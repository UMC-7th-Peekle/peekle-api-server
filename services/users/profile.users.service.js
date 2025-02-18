import models from "../../models/index.js";
import {
  AlreadyExistsError,
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import {
  addBaseUrl,
  deleteLocalFile,
} from "../../utils/upload/uploader.object.js";

import config from "../../config.js";

export const getProfile = async ({ userId }) => {
  const user = await models.Users.findByPk(userId, {
    attributes: { exclude: [] },
  });

  if (!user) {
    throw new NotExistsError("존재하지 않는 사용자 입니다.");
  }

  return {
    ...user.dataValues,
    profileImage: addBaseUrl(user.profileImage),
  };
};

export const getUserTerms = async ({ userId }) => {
  const terms = await models.UserTerms.findAll({
    where: { userId, termId: { [models.Sequelize.Op.ne]: null } },
    attributes: { exclude: ["userTermsId"] },
  });

  if (terms.length === 0) {
    throw new NotExistsError("약관 동의 정보가 존재하지 않습니다.");
  }

  return terms;
};

export const changeNickname = async ({ userId, nickname }) => {
  const user = await models.Users.findByPk(userId, {
    attributes: ["userId", "nickname", "lastNicknameChangeDate"],
  });

  console.log(user);

  if (!user) {
    throw new NotExistsError("존재하지 않는 사용자 입니다.");
  }

  if (user.lastNicknameChangeDate) {
    const now = new Date();
    const lastNicknameChangeDate = new Date(user.lastNicknameChangeDate);
    const diff = now - lastNicknameChangeDate;
    const diffDays = diff / (1000 * 60 * 60 * 24);

    if (diffDays < 30) {
      logger.warn("기한 이전 닉네임 변경 시도", {
        data: {
          userId,
          nickname,
          lastNicknameChangeDate,
          diffDays,
        },
      });
      throw new NotAllowedError("닉네임은 30일에 한 번만 변경할 수 있습니다.");
    }
  }

  logger.debug("닉네임 변경 가능", {
    data: {
      userId,
      nickname: {
        before: user.nickname,
        after: nickname,
      },
    },
  });

  await user.update({
    nickname,
    lastNicknameChangeDate: new Date().toISOString(),
  });
};

export const changeProfileImage = async ({
  userId,
  profileImage = config.PEEKLE.DEFAULT_PROFILE_IMAGE,
}) => {
  const data = await models.Users.findOne({
    where: { userId },
    attributes: ["userId", "profileImage"],
  });

  if (!data) {
    throw new InvalidInputError("존재하지 않는 사용자입니다.");
  }

  // DB에 저장된 이미지가 기본값이 아닌 경우 삭제
  if (data.profileImage !== config.PEEKLE.DEFAULT_PROFILE_IMAGE) {
    await deleteLocalFile(data.profileImage);
  } else {
    // DB에 저장된 이미지가 기본값인데 변경을 요청한게 기본값인 경우 에러
    if (profileImage === config.PEEKLE.DEFAULT_PROFILE_IMAGE) {
      throw new AlreadyExistsError("이미 기본 프로필 이미지 입니다.");
    }
  }
  await data.update({ profileImage });
};

export const changePhone = async ({ userId, phone }) => {
  const data = await models.Users.update({ phone }, { where: { userId } });
  if (!data) {
    throw new InvalidInputError("존재하지 않는 사용자입니다.");
  }
};

export const changeAccountStatus = async ({ userId, status }) => {
  const data = await models.Users.update({ status }, { where: { userId } });
  if (!data) {
    throw new InvalidInputError("존재하지 않는 사용자입니다.");
  }
};

export const deleteAccount = async ({ userId }) => {
  const data = await models.Users.destroy({ where: { userId } });
  if (!data) {
    throw new InvalidInputError("존재하지 않는 사용자입니다.");
  }
};

export const getBlockedUsers = async ({ userId }) => {
  const blockedUsers = await models.UserBlocks.findAll({
    where: { blockerUserId: userId, status: "active" },
    attributes: { exclude: ["blockId"] },
  });

  return blockedUsers;
};

export const blockUser = async ({ userId, targetUserId }) => {
  try {
    const data = await models.UserBlocks.create({
      blockerUserId: userId,
      blockedUserId: targetUserId,
    });
  } catch (err) {
    if (err instanceof models.Sequelize.UniqueConstraintError) {
      throw new AlreadyExistsError("이미 차단한 사용자입니다.");
    } else if (err instanceof models.Sequelize.ForeignKeyConstraintError) {
      throw new NotExistsError("존재하지 않는 사용자입니다.");
    }
    throw err;
  }
};

export const unblockUser = async ({ userId, targetUserId }) => {
  const data = await models.UserBlocks.destroy({
    where: { blockerUserId: userId, blockedUserId: targetUserId },
  });
  if (!data) {
    throw new NotExistsError("차단한 사용자가 아닙니다.");
  }
};

export const reportUser = async ({ userId, targetUserId, reason }) => {
  try {
    await models.Reports.create({
      type: "user",
      targetId: targetUserId,
      reporterUserId: userId,
      reason,
    });
  } catch (err) {
    if (err instanceof models.Sequelize.ForeignKeyConstraintError) {
      throw new NotExistsError("존재하지 않는 사용자입니다.");
    } else if (err instanceof models.Sequelize.UniqueConstraintError) {
      throw new AlreadyExistsError("이미 신고한 사용자입니다.");
    }
    throw err;
  }
  if (!data) {
    throw new InvalidInputError("신고할 수 없는 사용자입니다.");
  }
};

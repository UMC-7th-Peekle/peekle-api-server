import models from "../../models/index.js";
import {
  AlreadyExistsError,
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
} from "../../utils/errors/errors.js";

export const getProfile = async ({ userId }) => {
  const user = await models.Users.findByPk(userId, {
    attributes: { exclude: [] },
  });

  if (!user) {
    throw new NotExistsError("존재하지 않는 사용자 입니다.");
  }

  return user;
};

export const getUserTerms = async ({ userId }) => {
  const terms = await models.UserTerms.findAll({
    where: { userId },
    attributes: { exclude: ["userTermId"] },
  });

  if (!terms) {
    throw new NotExistsError("약관 동의 정보가 존재하지 않습니다.");
  }

  return terms;
};

export const changeNickname = async ({ userId, nickname }) => {
  const user = await models.Users.findByPk(userId, {
    attributes: ["lastNicknameChangeDate"],
  });

  if (!user) {
    throw new NotExistsError("존재하지 않는 사용자 입니다.");
  }

  if (user.lastNicknameChangeDate) {
    const now = new Date();
    const lastNicknameChangeDate = new Date(user.lastNicknameChangeDate);
    const diff = now - lastNicknameChangeDate;
    const diffDays = diff / (1000 * 60 * 60 * 24);

    if (diffDays < 30) {
      throw new NotAllowedError("닉네임은 30일에 한 번만 변경할 수 있습니다.");
    }
  }

  await user.update({ nickname });
};

export const changeProfileImage = async ({ userId, profileImage }) => {
  const data = await models.Users.update(
    { profileImage },
    { where: { userId } }
  );
  if (!data) {
    throw new InvalidInputError("존재하지 않는 사용자입니다.");
  }
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

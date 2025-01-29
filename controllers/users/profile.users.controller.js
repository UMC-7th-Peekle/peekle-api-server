import * as profileService from "../../services/users/profile.users.service.js";
import * as phoneService from "../../services/auth/phone.auth.service.js";

import { InvalidInputError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

import config from "../../config.json" with { type: "json" };

export const getProfile = async (req, res, next) => {
  try {
    const user = await profileService.getProfile({ userId: req.user.userId });

    return res.status(200).success({
      message: "사용자 정보를 조회했습니다.",
      data: user,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getUserTerms = async (req, res, next) => {
  try {
    const terms = await profileService.getUserTerms({
      userId: req.user.userId,
    });

    return res.status(200).success({
      message: "사용자 약관 동의 정보를 조회했습니다.",
      data: terms,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const changeNickname = async (req, res, next) => {
  try {
    await profileService.changeNickname({
      userId: req.user.userId,
      nickname: req.body.nickname,
    });

    return res.status(200).success({
      message: "닉네임을 변경했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const changeProfileImage = async (req, res, next) => {
  try {
    const uploadedFiles = req.files?.profile_image || [];
    if (uploadedFiles.length === 0) {
      throw new InvalidInputError("프로필 이미지를 업로드해주세요.");
    }

    await profileService.changeProfileImage({
      userId: req.user.userId,
      profileImage: parseImagePaths(uploadedFiles)[0],
    });

    return res.status(200).success({
      message: "프로필 이미지를 변경했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const deleteProfileImage = async (req, res, next) => {
  try {
    await profileService.changeProfileImage({
      userId: req.user.userId,
      profileImage: config.PEEKLE.DEFAULT_PROFILE_IMAGE,
    });

    return res.status(200).success({
      message: "프로필 이미지를 삭제했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const changePhone = async (req, res, next) => {
  try {
    const { phoneVerificationSessionId, phoneVerificationCode, phone } =
      req.body;

    await phoneService.verifyToken({
      id: phoneVerificationSessionId,
      phone: phone,
      code: phoneVerificationCode,
    });

    await profileService.changePhone({
      userId: req.user.userId,
      phone: phone,
    });

    return res.status(200).success({
      message: "전화번호를 변경했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const restoreUser = async (req, res, next) => {
  try {
    await profileService.changeAccountStatus({
      userId: req.body.userId,
      status: "active",
    });

    return res.status(200).success({
      message: "탈퇴 처리를 취소합니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const terminateUser = async (req, res, next) => {
  try {
    await profileService.changeAccountStatus({
      userId: req.user.userId,
      status: "terminated",
    });

    return res.status(200).success({
      message: "계정을 탈퇴 처리합니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const getBlockedUsers = async (req, res, next) => {
  try {
    const blockedUsers = await profileService.getBlockedUsers({
      userId: req.user.userId,
    });

    return res.status(200).success({
      message: "차단한 사용자 목록을 조회했습니다.",
      data: blockedUsers,
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    await profileService.blockUser({
      userId: req.user.userId,
      targetUserId: req.body.targetUserId,
    });

    return res.status(200).success({
      message: "사용자를 차단했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    await profileService.unblockUser({
      userId: req.user.userId,
      targetUserId: req.body.targetUserId,
    });

    return res.status(200).success({
      message: "사용자 차단을 해제했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

export const reportUser = async (req, res, next) => {
  try {
    await profileService.reportUser({
      userId: req.user.userId,
      targetUserId: req.body.targetUserId,
      reason: req.body.reason,
    });

    return res.status(200).success({
      message: "사용자를 신고했습니다.",
    });
  } catch (err) {
    logError(err);
    next(err);
  }
};

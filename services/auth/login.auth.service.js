import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import {
  findUserWithRestrictions,
  isDormantOrTerminatedUser,
  isRestrictedUser,
} from "./phone.auth.service.js";

/**
 * 전화번호로 사용자를 조회 후 userId를 리턴합니다
 */
export const getUserByPhone = async ({ phone }) => {
  const data = await findUserWithRestrictions({ phone });

  if (!data) {
    throw new InvalidInputError("가입되지 않은 전화번호입니다.");
  }

  if (data.userRestrictions && data.userRestrictions.length > 0) {
    isRestrictedUser(data.userRestrictions);
  }

  isDormantOrTerminatedUser(data);

  return data.userId;
};

export const logout = async ({ token }) => {
  try {
    await models.RefreshTokens.destroy({
      where: { token },
    });
  } catch (error) {
    logger.error(`[logout] DB에 존재하지 않는 RT로 로그아웃을 시도헀습니다.`);
  }

  return;
};

export const checkCookie = ({ cookie }) => {
  if (!cookie) {
    logger.error("[checkCookie] 쿠키가 필요합니다.");
    throw new InvalidInputError("Refresh Token이 존재하지 않습니다.");
  }
  logger.debug(`[checkCookie] 쿠키: ${cookie}`);
};

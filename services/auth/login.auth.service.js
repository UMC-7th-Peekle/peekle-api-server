import { token } from "morgan";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { InvalidInputError } from "../../utils/errors/errors.js";

/**
 * 전화번호로 사용자를 조회 후 userId를 리턴합니다
 */
export const getUserByPhone = async ({ phone }) => {
  const data = await models.Users.findOne({
    attributes: ["userId"],
    where: { phone },
  });

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

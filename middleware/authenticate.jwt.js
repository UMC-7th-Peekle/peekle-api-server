import jwt from "jsonwebtoken";

import logger from "../utils/logger/logger.js";
import config from "../config.json" with { type: "json" };
import {
  TokenError,
  NotAllowedError,
  UnauthorizedError,
} from "../utils/errors/errors.js";
import models from "../models/index.js";
const { JWT_SECRET } = config.SERVER;

/**
 * Bearer 토큰을 추출하고 검증하는 미들웨어
 */
export const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더가 없는 경우
  // 401 반환
  if (!authHeader)
    next(new UnauthorizedError("Authorization 헤더가 제공되지 않았습니다."));
  // Bearer Token인지 확인하기
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        logger.debug(
          `[authenticateAccessToken] 토큰 검증 실패: ${err.message}`
        );

        if (err.name === "TokenExpiredError") {
          next(new TokenError("만료된 토큰입니다."));
        } else if (err.name === "JsonWebTokenError") {
          next(new TokenError("토큰이 올바르지 않습니다."));
        } else if (err.name === "NotBeforeError") {
          next(new TokenError("아직 유효하지 않은 토큰입니다."));
        } else {
          next(new TokenError("알 수 없는 JWT 에러가 발생했습니다."));
        }
        return;
      }

      // payload 안의 user_id를 암호화하여 전달했을 경우 복호화
      // user_id = parseInt(decrypt62(user_id));
      logger.debug(`[authenticateAccessToken] AT userId : ${user.userId}`);
      req.user = {
        userId: user.userId,
      }; // 검증된 사용자 정보를 요청 객체에 추가
      next();
    });
  } else {
    next(new UnauthorizedError("Authorization이 제공되지 않았습니다."));
  }
};

/**
 * RefreshToken을 검증하는 미들웨어
 */
export const authenticateRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.PEEKLE_RT;

  if (!refreshToken) {
    logger.error("[authenticateRefreshToken] 쿠키에 RefreshToken이 없습니다.");
    next(new UnauthorizedError("RefreshToekn이 제공되지 않았습니다."));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.debug(`[authenticateAccessToken] 토큰 검증 실패: ${err.message}`);

      if (err.name === "TokenExpiredError") {
        next(new TokenError("만료된 토큰입니다."));
      } else if (err.name === "JsonWebTokenError") {
        next(new TokenError("토큰이 올바르지 않습니다."));
      } else if (err.name === "NotBeforeError") {
        next(new TokenError("아직 유효하지 않은 토큰입니다."));
      } else {
        next(new TokenError("알 수 없는 JWT 에러가 발생했습니다."));
      }
      return;
    }

    req.user = {
      userId: user.userId,
    }; // 검증된 사용자 정보를 요청 객체에 추가
  });

  // JWT token에 있는 userId가 DB와 일치하는지 확인하기

  // TODO : redis 등의 캐시 서버를 추가로 운용,
  // 성능 개선을 수치화해서 처리하기.
  const db = await models.RefreshTokens.findOne({
    attributes: ["userId"],
    where: {
      userId: req.user.userId,
      token: refreshToken,
    },
  });

  if (!db) {
    logger.error("[authenticateRefreshToken] Malformed RefreshToken");
    next(new NotAllowedError("RefreshToken이 일치하지 않습니다."));
    return;
  }

  next();
};

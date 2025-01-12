const jwt = require("jsonwebtoken");
const logger = require("../logger"); // 로거 설정 경로에 맞게 수정
const { UnauthorizedError, NotAllowedError } = require("../errors");
const { decrypt62 } = require("../utils/encrypt.util");
const { JWT_SECRET } = require("../config.json").SERVER;

/**
 * Bearer 토큰을 추출하고 검증하는 미들웨어
 */
const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn(`[authenticateAccessToken] 토큰 검증 실패: ${err.message}`);
        next(
          new NotAllowedError({
            message: "토큰이 유효하지 않습니다.",
            jwt_message: err.message,
          })
        );
        return;
      }

      let { user_id, name, nickname } = user;

      // payload 안의 user_id를 암호화하여 전달했을 경우 복호화
      // user_id = parseInt(decrypt62(user_id));

      req.user = {
        user_id,
        name,
        nickname,
      }; // 검증된 사용자 정보를 요청 객체에 추가
      next();
    });
  } else {
    logger.error("[authenticateAccessToken] 인증 헤더가 누락되었습니다.");
    next(new UnauthorizedError("Authorization이 제공되지 않았습니다."));
  }
};

// 일단은 만드는 김에 같이 만들긴 했는데
// handleReissueToken에서 이미 따로 작성을 한 상태라 사용될지는 모르곘음
const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.SPECTOGETHER_RT;

  if (!refreshToken) {
    logger.error("[authenticateRefreshToken] 쿠키에 RefreshToken이 없습니다.");
    next(new UnauthorizedError("RefreshToekn이 제공되지 않았습니다."));
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
    if (err) {
      logger.error(`[authenticateRefreshToken] 토큰 검증 실패: ${err.message}`);
      next(
        new NotAllowedError({
          message: "토큰이 유효하지 않습니다.",
          jwt_message: err.message,
        })
      );
    }

    let { user_id } = user;
    user_id = parseInt(decrypt62(user_id));

    req.user = {
      user_id,
    }; // 검증된 사용자 정보를 요청 객체에 추가
    next();
  });
};

module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
};

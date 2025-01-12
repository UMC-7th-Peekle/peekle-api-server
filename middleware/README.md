# 📂 미들웨어 함수를 작성하는 폴더입니다. 🛠️  
미들웨어는 인증처리 🔒, 업로드 📤 등 컨트롤러에서 공통적으로 사용되는 부분들을 몰아서 작성해놓은 부분입니다.

commonJS 방식으로 작성한 미들웨어 함수의 예시입니다.
```js
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
      user_id = parseInt(decrypt62(user_id));

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
```

```js
const { InvalidInputError } = require("../errors");

/**
 * 요청 데이터를 주어진 스키마로 검증하는 미들웨어 생성기.
 * @param {Function} schema - 스키마 검증 함수 (예: AJV에서 컴파일된 함수).
 * @returns {Function} - Express 미들웨어 함수.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const isValid = schema(req.body);

    if (!isValid) {
      const errorDetails = formatErrors(schema.errors);
      return next(
        new InvalidInputError("유효하지 않은 입력입니다.", errorDetails)
      );
    }

    next();
  };
};

/**
 * 스키마 검증 오류를 표준화된 형식으로 매핑.
 * @param {Array} errors - 스키마 검증기에서 반환된 오류 배열.
 * @returns {Array} - 매핑된 오류 세부 정보.
 */
const formatErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return [];

  return errors.map(({ instancePath, message }) => ({
    instancePath,
    message,
  }));
};

module.exports = validate;
```
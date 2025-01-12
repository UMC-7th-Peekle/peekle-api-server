# 📂 controllers

controller 함수들이 위치한 폴더입니다.  
각 엔드포인트별로 폴더를 생성하여 구분합니다.  
파일명은 `*.*.controller.js` 형식을 지켜주세요.

예를 들어, `/users` 와 `/auth` 엔드포인트가 있다면,  
하위 폴더로 users와 auth 가 있어야 합니다.  

또한, 한 폴더 내에서 파일명은 `세부명.엔드포인트명.controller.js` 여야 합니다.  
ex) `login.users.controller.js`

`login.auth.controller.js` 예시
```js
// import는 대다수 생략되어 있습니다. 느낌만 참고해주세요!

// import services
const loginService = require("../../services/auth/login.auth.service");
// import utils
const logger = require("../utils/logger/logger");

const localLogin = async (req, res, next) => {
  try {
    // 1. 미들웨어에서 데이터 검증
    // 2. 해당 사용자 존재여부 확인 (전화번호로)
    const data = await loginService.getUserPasswordByPhoneNumber(
      req.body.login_id
    );
    // 3. 비밀번호 확인
    await loginService.comparePassword({
      password: req.body.password,
      hashed_password: data.password,
    });

    // 4. JWT 토큰 발급
    // 4-1. access token 생성
    const accessToken = tokenService.createAccessToken({
      user_id: data.user_id,
      name: data.name,
      nickname: data.nickname,
    });
    // 4-2. refresh token 생성
    const refreshToken = await tokenService.createRefreshToken(data.user_id);

    logger.debug(
      `[localLogin] 토큰 발급 완료\
      \nAT : ${accessToken}\
      \nRT : ${refreshToken}`
    );

    const ret = {
      user_id: encrypt62(data.user_id),
      name: data.name,
      nickname: data.nickname,
    };

    logger.debug(`[localLogin] 응답 데이터: ${JSON.stringify(ret, null, 2)}`);

    // 5. 응답
    return res
      .status(200)
      .cookie("PEEKLE_RT", refreshToken, refreshTokenCookieOptions)
      .success({
        user: ret,
        access_token: accessToken,
      });
  } catch (err) {
    logError(err);
    next(err);
  }
};

module.exports = {
  localLogin
};
```
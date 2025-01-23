import config from "../../config.json" with { type: "json" };
const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = config.KAKAO;

import * as kakaoService from "../../services/auth/kakao.auth.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import { refreshTokenCookieOptions } from "../../utils/options/options.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/tokens/create.jwt.tokens.js";

// http://localhost:7777/auth/login/kakao/

export const kakaoLogin = async (req, res, next) => {
  try {
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    res.redirect(redirectUrl);
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 카카오 OAuth 콜백을 처리하는 컨트롤러.
 */
export const kakaoCallback = async (req, res, next) => {
  try {
    const authorizationCode = req.query.code;

    // 0. 인증 코드가 query에 존재하는지 확인
    kakaoService.checkAuthorizationCode(authorizationCode);

    // 1. 카카오에 인증 코드를 보내서 액세스 토큰을 받아옴
    const kakaoAccessToken =
      await kakaoService.getKakaoAccessToken(authorizationCode);

    // 2. 받아온 액세스 토큰으로 카카오 사용자 정보를 조회
    const kakaoUserInfo = await kakaoService.getKakaoUserInfo(kakaoAccessToken);
    console.log("kakaoUserInfo", kakaoUserInfo);

    // 3. 조회한 사용자 정보로 우리 DB에 사용자 정보를 조회
    const peekleUser = await kakaoService.checkIfUserExists(kakaoUserInfo);

    // 4-1. DB에 사용자 정보가 없다면 사용자 정보를 담아서 return
    if (!peekleUser) {
      return res.status(202).send(
        kakaoService.createScript({
          isRegistered: false,
          userInfo: {
            id: kakaoUserInfo.oauthId,
            email: kakaoUserInfo.email,
          },
        })
      );
    }

    // console.error("peekleUser", peekleUser);
    // 4-2. DB에 사용자 정보가 있다면 토큰 발급
    const accessToken = createAccessToken({ userId: peekleUser.userId });
    const refreshToken = await createRefreshToken({
      userId: peekleUser.userId,
    });

    // 4-3. 보낼 정보 생성
    const resData = kakaoService.createResponse(peekleUser);

    return res
      .status(200)
      .cookie("PEEKLE_RT", refreshToken, refreshTokenCookieOptions)
      .send(
        kakaoService.createScript({
          isRegistered: true,
          userInfo: resData,
          accessToken: accessToken,
        })
      );
  } catch (error) {
    logError(error);
    next(error);
  }
};

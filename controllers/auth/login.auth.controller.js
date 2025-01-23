import * as phoneService from "../../services/auth/phone.auth.service.js";
import * as loginService from "../../services/auth/login.auth.service.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/tokens/create.jwt.tokens.js";
import { logError } from "../../utils/handlers/error.logger.js";
import { refreshTokenCookieOptions } from "../../utils/options/options.js";

export const localLogin = async (req, res, next) => {
  try {
    /*
        {
      "phone": "555-555-5555",
      "phoneVerificationSessionId": "123456",
      "phoneVerificationCode": "123456"
    }
    */
    const { phone, phoneVerificationSessionId, phoneVerificationCode } =
      req.body;

    // 인증세션과 전화번호를 활용해서
    // 해당 전화번호가 해당 인증세션에서 사용된 값과 일치하는지 확인
    await phoneService.getAndVerifyPhoneBySessionId({
      id: phoneVerificationSessionId,
      phone,
    });

    // 인증 코드를 확인합니다.
    await phoneService.verifyToken({
      id: phoneVerificationSessionId,
      token: phoneVerificationCode,
      phone,
    });

    const userId = await loginService.getUserByPhone({ phone });
    const refreshToken = await createRefreshToken({ userId });

    return res
      .status(200)
      .cookie("PEEKLE_RT", refreshToken, refreshTokenCookieOptions)
      .success({
        message: "로그인에 성공했습니다.",
        accessToken: createAccessToken({ userId }),
      });
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 테스트 로그인, :userId로 로그인합니다.
 */
export const testLogin = async (req, res, next) => {
  try {
    // 테스트용 로그인
    const userId = req.params.userId;
    const refreshToken = await createRefreshToken({ userId });

    return res
      .status(200)
      .cookie("PEEKLE_RT", refreshToken, refreshTokenCookieOptions)
      .success({
        message: "로그인에 성공했습니다.",
        accessToken: createAccessToken({ userId }),
      });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    loginService.checkCookie({ cookie: req.cookies.PEEKLE_RT });
    // 로그아웃 처리
    await loginService.logout({ token: req.cookies.PEEKLE_RT });

    return res.status(200).clearCookie("PEEKLE_RT").success({
      message: "로그아웃 되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const reissueToken = async (req, res, next) => {
  try {
    // RT 검증하고 AT 발급하면 됨
    return res.status(200).success({
      message: "토큰이 재발급 되었습니다.",
      accessToken: createAccessToken({ userId: req.user.userId }),
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

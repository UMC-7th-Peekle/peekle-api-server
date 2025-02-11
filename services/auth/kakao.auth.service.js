import axios from "axios";

import models from "../../models/index.js";
import { NotExistsError } from "../../utils/errors/errors.js";

import logger from "../../utils/logger/logger.js";

import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/tokens/create.jwt.tokens.js";
import { encrypt62 } from "../../utils/cipher/encrypt.js";

import config from "../../config/config.json" with { type: "json" };

const { KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI, KAKAO_REST_API_KEY } =
  config.KAKAO;

const { FRONTEND_URL } = config.SERVER;

// http://localhost:7777/auth/login/kakao

/**
 * 카카오 OAuth 인증 코드를 사용하여 액세스 토큰을 요청하는 함수.
 */
export const getKakaoAccessToken = async (authorizationCode) => {
  logger.info(`[getKakaoAccessToken] 인증 코드: ${authorizationCode}`);
  const tokenResponse = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: authorizationCode,
        client_secret: KAKAO_CLIENT_SECRET, // 필요한 경우
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return tokenResponse.data.access_token;
};

/**
 * 카카오 액세스 토큰을 사용하여 사용자 정보를 조회하는 함수.
 * @async
 * @function getKakaoUserInfo
 * @param {string} accessToken - The access token from Kakao.
 * @returns {{
 *   oauthId: number,
 *   name: string,
 *   nickname: string,
 *   email: string,
 *   profileImage: string
 * }} An object containing Kakao user information.
 */
export const getKakaoUserInfo = async (accessToken) => {
  const userInfoResponse = await axios.get(
    "https://kapi.kakao.com/v2/user/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        property_keys: [
          "kakao_account.email",
          "kakao_account.profile.nickname",
          "kakao_account.profile.profile_image_url",
        ],
      },
    }
  );

  logger.debug(
    `[getKakaoUserInfo] 사용자 정보: ${JSON.stringify(userInfoResponse.data, null, 2)}`
  );

  const { id, properties, kakao_account } = userInfoResponse.data;

  return {
    oauthId: id,
    name: properties.nickname,
    nickname: properties.nickname,
    email: kakao_account.email,
    profileImage: properties.profile_image,
  };
};

/**
 * 인증코드가 존재하는지 식별
 */
export const checkAuthorizationCode = (authorizationCode) => {
  if (!authorizationCode) {
    logger.error("[checkAuthorizationCode] 인증 코드가 필요합니다.");
    throw new NotExistsError("인증 코드가 필요합니다.");
  }
  logger.debug(`[checkAuthorizationCode] 인증 코드: ${authorizationCode}`);
};

/**
 * 해당하는 사용자 정보가 있는지 확인
 */
export const checkIfUserExists = async (data) => {
  const info = await models.Users.findOne({
    attributes: ["userId", "name", "nickname"],
    include: [
      {
        model: models.UserOauth,
        as: "userOauths",
        attributes: ["userId"],
        where: {
          oauthType: "kakao",
          oauthId: data.oauthId,
        },
      },
    ],
  });

  if (!info) {
    logger.error("[checkIfUserExist] 가입되어 있지 않은 사용자입니다.");
    return false;
  }

  return {
    userId: info.userId,
    name: info.name,
    nickname: info.nickname,
  };
};

export const createScript = (data) => {
  return `
    <script>
      window.opener.postMessage(${JSON.stringify(data)}, '${FRONTEND_URL}');
      window.close();
    </script>
  `;
};

export const createResponse = (data) => {
  return {
    userId: data.userId,
    name: data.name,
    nickname: data.nickname,
  };
};

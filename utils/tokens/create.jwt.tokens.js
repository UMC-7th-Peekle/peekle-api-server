import jwt from "jsonwebtoken";
import config from "../../config.json" with { type: "json" };
const { JWT_SECRET } = config.SERVER;

/**
 * Access Token을 생성합니다. Bearer를 붙여서 반환합니다.
 * 1시간의 유효기간을 가지고 있습니다.
 * @param {int} userId
 * @returns {string} - Bearer Token
 */
export const createAccessToken = ({ userId }) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return `Bearer ${token}`;
};

/**
 * Refresh Token을 생성합니다. JWT string 만을 반환합니다.
 * @param {int} userId
 * @returns {string} - Refresh Token
 */
export const createRefreshToken = ({ userId }) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};
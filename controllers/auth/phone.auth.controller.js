import * as phoneService from "../../services/auth/phone.auth.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * 전화번호로 사용자가 존재하는지, 계정 상태 확인
 * registered, unregistered, blocked, dormant, deleted
 */
export const checkAccountStatus = async (req, res, next) => {
  try {
    const { phone } = req.query;
    const result = await phoneService.checkAccountStatus({ phone });
    return res.status(200).success(result);
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const sendTokenToPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const encryptedId = await phoneService.sendTokenToPhone({ phone });
    return res.status(200).success({
      message: "인증번호가 전송되었습니다.",
      phoneVerificationSessionId: encryptedId,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const { phone, phoneVerificationSessionId, phoneVerificationCode } =
      req.body;
    await phoneService.verifyToken({
      id: phoneVerificationSessionId,
      token: phoneVerificationCode,
      phone,
    });
    return res.status(200).success({ message: "인증에 성공했습니다." });
  } catch (error) {
    logError(error);
    next(error);
  }
};

import * as phoneService from "../../services/auth/phone.auth.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const phoneUnique = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await phoneService.checkPhoneUnique({ phone });
    if (result)
      return res
        .status(200)
        .success({ message: "사용 가능한 전화번호입니다." });
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
    const { phoneVerificationSessionId, phoneVerificationCode } = req.body;
    await phoneService.verifyToken({
      id: phoneVerificationSessionId,
      token: phoneVerificationCode,
    });
    return res.status(200).success({ message: "인증에 성공했습니다." });
  } catch (error) {
    logError(error);
    next(error);
  }
};

import { getAndVerifyPhoneBySessionId } from "../../services/auth/phone.auth.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import * as registerService from "../../services/auth/register.auth.service.js";
import * as phoneService from "../../services/auth/phone.auth.service.js";
import { InvalidInputError } from "../../utils/errors/errors.js";

export const register = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.

    // 제공된 인증세션의 전화번호와 제공된 전화번호가 일치하는지 확인
    await getAndVerifyPhoneBySessionId({
      id: req.body.phoneVerificationSessionId,
      phone: req.body.phone,
    });

    // 해당 전화번호가 unique한지 확인
    await phoneService.checkPhoneUnique({ phone: req.body.phone });

    // 회원가입 처리
    await registerService.register(req.body);

    return res.status(201).success({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

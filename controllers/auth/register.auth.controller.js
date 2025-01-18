import { getPhoneBySessionId } from "../../services/auth/phone.auth.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import * as registerService from "../../services/auth/register.auth.service.js";
import { InvalidInputError } from "../../utils/errors/errors.js";

export const register = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.

    const sessionPhone = await getPhoneBySessionId(
      req.body.phoneVerificationSessionId
    );

    if (sessionPhone !== req.body.phone) {
      throw new InvalidInputError("인증되지 않은 전화번호 입니다.");
    }

    await registerService.register({ ...req.body, phone });

    return res.status(201).success({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

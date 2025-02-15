import { logError } from "../../utils/handlers/error.logger.js";
import * as registerService from "../../services/auth/register.auth.service.js";
import * as phoneService from "../../services/auth/phone.auth.service.js";

export const register = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.

    // 제공된 인증세션의 전화번호와 제공된 전화번호가 일치하는지 확인 및
    // 인증되었는지 확인하기
    await phoneService.isSessionVerified({
      id: req.body.phoneVerificationSessionId,
      phone: req.body.phone,
    });

    // 회원가입 처리
    await registerService.register(req.body);

    // TODO : terms 처리를 안하고 있음.

    return res.status(201).success({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const oauthRegister = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
    // local과의 차이점 : oauthType, oauthId 를 제공해야 함.

    // 제공된 인증세션의 전화번호와 제공된 전화번호가 일치하는지 확인 및
    // 인증되었는지 확인하기
    await phoneService.isSessionVerified({
      id: req.body.phoneVerificationSessionId,
      phone: req.body.phone,
    });

    // 회원가입 처리
    await registerService.oauthRegister(req.body);

    return res.status(201).success({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const testRegister = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.

    let data = {
      name: req.body.name || "TestUser",
      nickname: req.body.nickname || "TestNickname",
      birhdate: req.body.birthdate || "2000-01-01",
      gender: req.body.gender || "male",
      phone: req.body.phone || "112",
      // email: req.body.email || "email",
      profileImage: req.body.profileImage || null,
    };

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

export const getTerms = async (req, res, next) => {
  try {
    const terms = await registerService.getTerms();

    if (terms.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).success({
      message: "약관 조회에 성공했습니다.",
      terms,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const checkNicknameUnique = async (req, res, next) => {
  try {
    const { nickname } = req.query;

    await registerService.checkNicknameUnique(nickname);

    return res.status(200).success({
      message: "사용 가능한 닉네임 입니다.",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

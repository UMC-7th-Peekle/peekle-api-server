import {
  decrypt62,
  encrypt62,
  generate4DigitToken,
} from "../../utils/cipher/encrypt.js";

import {
  AlreadyExistsError,
  InvalidCodeError,
  InvalidInputError,
  NotExistsError,
  NotVerifiedError,
  RestrictedUserError,
  TimeOutError,
  TooManyRequest,
  UserStatusError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

import * as coolSMS from "../../utils/sms/coolsms.js";

/**
 * 제재된 사용자인지 확인합니다.
 */
export const isRestrictedUser = (data) => {
  if (data.userRestrictions && data.userRestrictions.length > 0) {
    data.userRestrictions.forEach((restriction) => {
      const restrictionEndDate = new Date(restriction.endsAt).getTime();
      const currentDate = Date.now();

      if (restriction.type == "suspend" && restrictionEndDate > currentDate) {
        logger.error(
          `[checkAccountStatus] 정지 상태인 사용자가 로그인을 시도했습니다. userId: ${result.userId}`
        );
        throw new RestrictedUserError(
          `${restriction.endsAt} 까지 이용이 정지된 사용자입니다.`,
          {
            type: restriction.type,
            reason: restriction.reason,
            endsAt: restriction.endsAt,
            restrictedAt: restriction.createdAt,
          }
        );
      } else if (restriction.type == "ban") {
        logger.error(
          `[checkAccountStatus] 영구 정지 상태인 사용자가 로그인을 시도했습니다. userId: ${result.userId}`
        );
        throw new RestrictedUserError(
          `영구적으로 이용이 정지된 사용자입니다.`,
          {
            type: restriction.type,
            reason: restriction.reason,
            restrictedAt: restriction.createdAt,
          }
        );
      }
    });
  }
};

/**
 * 휴면이거나 탈퇴한지 7일이 되지 않은 사용자인지 확인합니다.
 */
export const isDormantOrTerminatedUser = (data) => {
  if (data.terminationDate) {
    throw new UserStatusError("탈퇴한 사용자입니다.", {
      message: "탈퇴한 사용자입니다.",
      terminationDate: data.terminationDate,
    });
  }

  if (data.dormantDate) {
    throw new UserStatusError("휴면 상태인 사용자입니다.", {
      message: "휴면 상태인 사용자입니다.",
      dormantDate: data.dormantDate,
    });
  }
};

/**
 * 전화번호로 사용자를 검색하되, 제재사항까지 가져옵니다.
 */
export const findUserWithRestrictions = async ({ phone }) => {
  return await models.Users.findOne({
    attributes: ["userId", "dormantDate", "terminationDate"],
    where: {
      phone,
    },
    include: [
      {
        model: models.UserRestrictions,
        as: "userRestrictions",
        attributes: ["type", "reason", "endsAt", "createdAt"],
        where: {
          type: ["suspend", "ban"],
        },
        required: false,
      },
    ],
  });
};

/**
 * 전화번호로 사용자가 존재하는지, 계정 상태 확인
 */
export const checkAccountStatus = async ({ phone }) => {
  const result = await findUserWithRestrictions({ phone });

  logger.debug(
    `[checkAccountStatus] result: ${JSON.stringify(result, null, 2)}`
  );

  // 사용자가 존재하지 않는 경우
  if (!result) {
    return {
      message: "가입되지 않은 전화번호입니다.",
    };
  }

  // 사용자 제재 이력이 존재하고, 활성 상태인 제재가 존재하는 경우
  isRestrictedUser(result);

  // 탈퇴했거나 휴면인 사용자.
  // 탈퇴한게 우선이기 때문에 우선 배치 .. 인데 탈퇴를 고려하여야 하나?

  isDormantOrTerminatedUser(result);

  return {
    message: "가입된 사용자의 전화번호입니다.",
  };
};

export const sendTokenToPhone = async ({ phone }) => {
  // 토큰을 생성하고, db에 저장하고, 사용자에게 전송

  const token = generate4DigitToken();
  const record = await models.VerificationCode.create({
    identifierType: "phone",
    identifierValue: phone,
    attempts: 0,
    code: token,
  });

  // 입력값으로 들어오는 전화번호는 10으로 시작하고 공백이 존재하지 않아야 합니다.
  // const southKoreaPhone = "+82" + phone.slice(1);
  const message = `[Peekle, 피클] 인증번호는 ${token} 입니다.\n절대 타인에게 노출하지 마세요.`;

  // COOLSMS 사용
  const result = await coolSMS.sdkSendSMS(phone, message);
  logger.debug(`[sendTokenToPhone] result: ${JSON.stringify(result, null, 2)}`);
  logger.debug("전화번호 인증 요청", {
    action: "verifyPhone:send",
    data: {
      phone,
      message,
      result,
    },
  });

  return encrypt62(record.sessionId);
};

/**
 * 인증 세션 ID, 전화번호, 토큰값을 받아서 인증을 처리합니다
 */
export const verifyToken = async ({ id, token, phone }) => {
  // 1. DB에 존재하는 인증 세션인지 조회
  const decryptedId = decrypt62(id);
  // logger.debug(`[verifyToken] decryptedId: ${decryptedId}`);

  const record = await models.VerificationCode.findOne({
    attributes: [
      "sessionId",
      "attempts",
      "code",
      "identifierValue",
      "createdAt",
    ],
    where: {
      sessionId: decryptedId,
      isVerified: false,
    },
  });

  logger.debug("SMS 전화번호 인증 확인 요청", {
    action: "verifyPhone:verify",
    data: {
      id,
      token,
      phone,
    },
  });
  // 1-1. 존재하지 않는 세션인 경우 에러 리턴
  if (!record) {
    logger.error("존재하지 않는 인증 세션에 대한 인증 요청", {
      action: "verifyPhone:verify",
      actionType: "request",
      data: {
        id,
        token,
        phone,
      },
    });
    throw new NotExistsError(
      "이미 인증되었거나, 존재하지 않는 인증 세션입니다."
    );
  }

  // 1-2. 인증하려는 전화번호가 일치하는지 확인
  if (record.identifierValue !== phone) {
    logger.error(
      "인증을 요청하며 전송한 전화번호가 인증 세션에 기록된 정보와 일치하지 않습니다.",
      {
        action: "verifyPhone:verify",
        actionType: "request",
        data: {
          id,
          token,
          phone,
        },
      }
    );
    throw new InvalidInputError("인증하려는 전화번호가 아닙니다.");
  }

  // 2. 인증 시간 (5분을 초과하지는 않았는지 확인)
  const VERIFICATION_TIME_LIMIT = 5 * 60 * 1000; // 5분
  const now = Date.now();
  const createdAt = new Date(record.createdAt).getTime();
  if (now - createdAt > VERIFICATION_TIME_LIMIT) {
    // 2-1. 만료된 인증세션인 경우 에러 리턴 및 해당 세션 삭제
    await record.destroy();
    logger.error("인증 시간이 만료된 인증 세션에 대한 인증 요청", {
      action: "verifyPhone:verify",
      actionType: "request",
      data: {
        id,
        token,
        phone,
      },
    });
    throw new TimeOutError("인증 시간이 만료되었습니다.");
  }

  // 3. 인증 횟수를 초과하지는 않았는지 확인
  const MAX_ATTEMPTS = 10;
  if (record.attempts >= MAX_ATTEMPTS) {
    // 3-1. 인증 시도 횟수를 초과한 경우 에러 리턴 및 해당 세션 삭제
    await record.destroy();
    throw new TooManyRequest("인증 시도 횟수를 초과하였습니다.", {
      currentAttempts: record.attempts,
      maxAttempts: MAX_ATTEMPTS,
    });
    // TODO : 10회 이상 잘못 입력했을 경우 10분 후 동일한 전화번호로는 10분 후 시도 가능하게 해야함
  }

  // 4. 토큰 비교
  if (record.code !== token) {
    // 4-1. 토큰이 일치하지 않는 경우 attempts 증가 후 에러 리턴
    await record.update({ attempts: record.attempts + 1 }); // update로 구문 수정
    throw new InvalidCodeError("인증 코드가 일치하지 않습니다.", {
      currentAttempts: record.attempts,
      maxAttempts: MAX_ATTEMPTS,
    });
  }
  // 4-2. 토큰 일치하는 경우 true 리턴
  else {
    // 4-3. DB에서 인증세션 삭제
    // await record.destroy();
    // 인증세션을 삭제할 경우 추후 테이블 ID를 기반으로
    // 전화번호를 조회하는 기능을 사용할 수 없음에 따라 변경합니다.

    // 4-4. 사용자의 전화번호를 인증 처리
    record.isVerified = true;
    await record.save();

    // 추후 일괄적으로 삭제하는 로직을 구성할 필요가 있습니다.
    return true;
  }
};

/**
 * 전화번호를 받아, 해당 인증세션에서 사용된 전화번호와 일치하는지 확인합니다.
 * 인증여부는 판단하지 않습니다.
 */
export const getAndVerifyPhoneBySessionId = async ({ id, phone }) => {
  const decryptedId = decrypt62(id);
  const record = await models.VerificationCode.findOne({
    attributes: ["identifierValue"],
    where: {
      sessionId: decryptedId,
      // isVerified: true,
    },
  });

  // if (!record) {
  //   throw new InvalidInputError(
  //     "인증되지 않았거나, 존재하지 않는 세션 ID 입니다."
  //   );
  // }

  // 이 함수는 인증여부를 확인할 필요 없이 인증을 시도한 전화번호와
  // 기존에 인증을 요청한 전화번호가 일치하는지만 확인하면 됨

  if (record.identifierValue !== phone) {
    throw new InvalidInputError("인증되지 않은 전화번호 입니다.");
  }

  return record.identifierValue;
};

/**
 * 전화번호를 받아, 해당 인증세션에서 사용된 전화번호와 일치하는지 확인 및 인증여부를 확인합니다.
 */
export const isSessionVerified = async ({ id, phone }) => {
  const decryptedId = decrypt62(id);
  const record = await models.VerificationCode.findOne({
    attributes: ["sessionId"],
    where: {
      sessionId: decryptedId,
      identifierValue: phone,
      isVerified: true,
    },
  });

  if (!record) {
    throw new NotVerifiedError(
      "인증되지 않았거나, 존재하지 않는 세션 ID 입니다."
    );
  }

  return;
};

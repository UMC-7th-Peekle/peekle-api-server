import {
  decrypt62,
  encrypt62,
  generate6DigitToken,
} from "../../utils/cipher/encrypt.js";

import {
  AlreadyExistsError,
  InvalidCodeError,
  InvalidInputError,
  NotExistsError,
  TimeOutError,
  TooManyRequest,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

import * as coolSMS from "../../utils/sms/coolsms.js";

export const checkPhoneUnique = async ({ phone }) => {
  //
  const result = await db.Users.findOne({
    attributes: ["userId"],
    where: {
      phone,
    },
  });

  if (result) {
    throw new AlreadyExistsError("이미 존재하는 전화번호입니다.");
  }
  return true;
};

export const sendTokenToPhone = async ({ phone }) => {
  // 토큰을 생성하고, db에 저장하고, 사용자에게 전송

  const token = generate6DigitToken();
  const record = await db.VerificationCode.create({
    identifierType: "phone",
    identifierValue: phone,
    attempts: 0,
    code: token,
  });

  // 입력값으로 들어오는 전화번호는 10으로 시작하고 공백이 존재하지 않아야 합니다.
  // const southKoreaPhone = "+82" + phone.slice(1);
  const message = `[Peekle, 피클] 인증번호는 ${token} 입니다.\n절대 타인에게 노출하지 마세요.`;
  logger.debug(`[sendTokenToPhone]\n핸드폰번호: ${phone}\n메세지: ${message}`);

  // COOLSMS 사용 시
  const result = await coolSMS.sdkSendSMS(phone, message);
  logger.debug(`[sendTokenToPhone] result: ${JSON.stringify(result, null, 2)}`);

  return encrypt62(record.sessionId);
};

/**
 * 인증 세션 ID, 전화번호, 토큰값을 받아서 인증을 처리합니다
 */
export const verifyToken = async ({ id, token, phone }) => {
  // 1. DB에 존재하는 인증 세션인지 조회
  const decryptedId = decrypt62(id);
  logger.debug(`[verifyToken] decryptedId: ${decryptedId}`);

  const record = await db.VerificationCode.findOne({
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
  logger.debug(`[verifyToken] record: ${JSON.stringify(record, null, 2)}`);
  // 1-1. 존재하지 않는 세션인 경우 에러 리턴
  if (!record) {
    throw new NotExistsError(
      "이미 인증되었거나, 존재하지 않는 인증 세션입니다."
    );
  }

  // 1-2. 인증하려는 전화번호가 일치하는지 확인
  if (record.identifierValue !== phone) {
    logger.error(
      `[verifyToken] 인증 세션과 다른 전화번호로 인증을 시도하였습니다. sessionId: ${decryptedId}, phone: ${phone}, identifierValue: ${record.identifierValue}`
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
    throw new TimeOutError("인증 시간이 만료되었습니다.");
  }

  // 3. 인증 횟수를 초과하지는 않았는지 확인
  const MAX_ATTEMPTS = 10;
  if (record.attempts > MAX_ATTEMPTS) {
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
    record.attempts += 1;
    await record.save();
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
 * 인증 세션 ID와 전화번호를 받아서 그 진위여부를 판단합니다.
 */
export const getAndVerifyPhoneBySessionId = async ({ id, phone }) => {
  const decryptedId = decrypt62(id);
  const record = await db.VerificationCode.findOne({
    attributes: ["identifierValue"],
    where: {
      sessionId: decryptedId,
      isVerified: true,
    },
  });

  if (!record) {
    throw new InvalidInputError(
      "인증되지 않았거나, 존재하지 않는 세션 ID 입니다."
    );
  }

  if (record.identifierValue !== phone) {
    throw new InvalidInputError("인증되지 않은 전화번호 입니다.");
  }

  return record.identifierValue;
};

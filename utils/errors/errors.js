/**
 * 상속받아 사용하는 에러 클래스
 */
export class CustomError extends Error {
  constructor(reason, errorCode, statusCode, data = null) {
    super(reason); // error.message = reason
    this.reason = reason; // error.reason = reason
    this.name = this.constructor.name;
    this.errorCode = errorCode; // 한두단어로 에러표시. "SAMPLE_ERROR"
    this.statusCode = statusCode; // 해당 에러 발생 시 전달할 응답코드. 500
    this.data = data; // 추가 에러 데이터.
    Error.captureStackTrace(this, this.constructor);
  }
}

/*
사용할 땐 아래와 같이 사용하면 됩니다.
throw new SampleError("그냥 냈음", { data1: "sample data 1", data2: "sample data 2" });
*/

/**
 * 에러 추가하는 방법 예시
 */
export class SampleError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "SAMPLE_ERROR", 500, data);
  }
}

/**
 * 사용자의 입력값이 잘못됨
 */
export class InvalidInputError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "INVALID_INPUT", 400, data);
  }
}

/**
 * 요청한게 이미 존재하는 경우
 */
export class AlreadyExistsError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "ALREADY_EXISTS", 409, data);
  }
}

/**
 * 요청한게 존재하지 않는 경우
 */
export class NotExistsError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "NOT_EXISTS", 404, data);
  }
}

/**
 * 인증은 되었으나 권한이 부족한 경우
 */
export class NotAllowedError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "NOT_ALLOWED", 403, data);
  }
}

/**
 * 인증 정보가 제공되어 있지 않은 경우
 */
export class UnauthorizedError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "UNAUTHORIZED", 401, data);
  }
}

/**
 * JWT 토큰에 문제가 있는 경우
 */
export class TokenError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "CHECK_JWT_TOKEN", 401, data);
  }
}

/**
 * request 형식이 올바르지 않은 경우
 */
export class AjvError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "AJV_INVALID_INPUT", 400, data);
  }
}

/**
 * 디버깅용
 */
export class UnknownError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "UNKNOWN_ERROR", 500, data);
  }
}

/**
 * 전화번호 인증시간 만료
 */
export class TimeOutError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "SESSION_TIMEOUT", 400, data);
  }
}
/**
 * 전화번호 최대 인증가능 횟수 초과
 */
export class TooManyRequest extends CustomError {
  constructor(reason, data = null) {
    super(reason, "TOO_MANY_ATTEMPTS", 429, data);
  }
}
/**
 * 전화번호 인증코드 불일치
 */
export class InvalidCodeError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "INVALID_CODE", 400, data);
  }
}
/**
 * Cipher 오류
 */
export class CipherError extends CustomError {
  constructor(reason, data = null) {
    super(reason, "CIPHER_ERROR", 503, data);
  }
}

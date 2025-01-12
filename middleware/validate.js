const { InvalidInputError } = require("../errors");

/**
 * 요청 데이터를 주어진 스키마로 검증하는 미들웨어 생성기.
 * @param {Function} schema - 스키마 검증 함수 (예: AJV에서 컴파일된 함수).
 * @returns {Function} - Express 미들웨어 함수.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const isValid = schema(req.body);

    if (!isValid) {
      const errorDetails = formatErrors(schema.errors);
      return next(
        new InvalidInputError("유효하지 않은 입력입니다.", errorDetails)
      );
    }

    next();
  };
};

/**
 * 스키마 검증 오류를 표준화된 형식으로 매핑.
 * @param {Array} errors - 스키마 검증기에서 반환된 오류 배열.
 * @returns {Array} - 매핑된 오류 세부 정보.
 */
const formatErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) return [];

  return errors.map(({ instancePath, message }) => ({
    instancePath,
    message,
  }));
};

module.exports = validate;

import { AjvError, InvalidContentTypeError } from "../utils/errors/errors.js";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import logger from "../utils/logger/logger.js";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/**
 * 요청 데이터를 주어진 스키마로 검증하는 미들웨어 생성기.
 * @param {Function} schema - 스키마 검증 함수 (예: AJV에서 컴파일된 함수).
 * @returns {Function} - Express 미들웨어 함수.
 */
export const validateRequestBody = (schema, isParsedFormData = false) => {
  return (req, res, next) => {
    const validator = ajv.compile(schema);
    const data = isParsedFormData ? JSON.parse(req.body.data) : req.body;

    // logger.silly(data);
    const isValid = validator(data);

    if (!isValid) {
      const errorDetails = formatErrors(validator.errors);
      return next(new AjvError("올바르지 않은 요청 형식입니다.", errorDetails));
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

  /*
    original message:
    {
      instancePath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: { missingProperty: 'oauthId' },
      message: "must have required property 'oauthId'"
    },
  */

  return errors.map(({ instancePath, message }) => ({
    instancePath,
    message,
  }));
};

export const validateContentType = (req, res, next) => {
  if (!req.is("multipart/form-data")) {
    next(
      new InvalidContentTypeError("Content-Type should be: multipart/form-data")
    );
  }
  next();
};

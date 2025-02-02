import logger from "../logger/logger.js";
import { logError } from "./error.logger.js";

export const responseHandler = (req, res, next) => {
  res.success = (success) =>
    res.json({ resultType: "SUCCESS", error: null, success });

  res.error = ({ errorCode = "UNHANDLED_ERROR", reason = null, data = null }) =>
    res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });

  next();
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error(
      "이미 응답이 전송된 요청에 대해 에러 핸들러가 호출되었습니다."
    );
    return next(err);
  }
  logError(err);
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "UNHANDLED_ERROR",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
};

export const setNoCache = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
};

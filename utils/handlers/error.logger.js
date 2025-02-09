import logger from "../logger/logger.js";

export const logError = (err) => {
  // logger.error(`
  //   ===== ERROR LOG =====
  //   NAME: ${err.name}
  //   REASON: ${JSON.stringify(err.reason, null, 2)}
  //   MESSAGE: ${JSON.stringify(err.message, null, 2)}
  //   STACK: ${err.stack}
  //   =====================
  // `);
  console.error(err);
  const errorDetails = Object.getOwnPropertyNames(err).reduce((acc, key) => {
    acc[key] = err[key];
    return acc;
  }, {});
  logger.error("통합 에러 로그", {
    action: "handler:logError",
    errorDetails,
  });
};

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

  logger.error({
    action: "handler:logError",
    actionType: "error",
    name: err.name,
    reason: err.reason,
    message: err.message,
    stack: err.stack,
  });
};

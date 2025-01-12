import logger from "../../logger";

export const socketErrorHandler = (socket, on, err) => {
  logger.error(
    `[errorHandler]\
      \nON ${on}\
      \nNAME ${err.name}\
      \nREASON ${JSON.stringify(err.reason, null, 2)}\
      \nMESSAGE ${JSON.stringify(err.message, null, 2)}\
      \nSTACK ${err.stack}\
      \nDATA ${JSON.stringify(err.data, null, 2)}\
      \n`
  );

  socket.emit("error", {
    on: on || null,
    error:
      typeof err.message === "string"
        ? err.message
        : JSON.stringify(err.message),
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
};

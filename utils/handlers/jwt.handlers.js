import jwt from "jsonwebtoken";
import config from "./config.json" with { type: "json" };
import logger from "../logger/logger.js";

const { JWT_SECRET } = config.SERVER;

export const parseBearerFromHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    req.token = token;
    logger.info(`Parsed token: ${token}`);
  }
  next();
};

export const decodeToken = (req, res, next) => {
  const token = req.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      logger.info(`Decoded token: ${JSON.stringify(decoded, null, 2)}`);
    } catch (error) {
      logger.error(`Token decoding error: ${error.message}`);
    }
  }
  next();
};

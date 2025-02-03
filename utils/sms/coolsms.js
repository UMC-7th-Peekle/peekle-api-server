import CoolsmsMessageService from "coolsms-node-sdk"; // default import로 변경
import axios from "axios";
import crypto from "crypto";
import logger from "../logger/logger.js";
import config from "../../config.json" with { type: "json" };
import { logError } from "../handlers/error.logger.js";

const { API_KEY, API_SECRET, SENDER } = config.COOLSMS;

// 바로 생성자를 사용하여 messageService 생성
const messageService = new CoolsmsMessageService(API_KEY, API_SECRET);

const getAuthorizationHeader = async (apiKey, apiSecret) => {
  const date = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 15);
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(date + salt)
    .digest("hex");

  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
};

export const axiosSendSMS = async (to, from, text) => {
  const apiKey = API_KEY;
  const apiSecret = API_SECRET;
  const url = "https://api.coolsms.co.kr/messages/v4/send";

  const headers = {
    "Content-Type": "application/json",
    Authorization: await getAuthorizationHeader(apiKey, apiSecret),
  };

  const data = {
    message: { to, from, text },
  };

  try {
    const response = await axios.post(url, data, { headers });
    logger.debug("메시지가 성공적으로 전송되었습니다:", {
      data: response.data,
    });
    return response.data;
  } catch (error) {
    logger.error("메시지 전송 중 오류가 발생했습니다:", {
      data: error.response?.data || error.message,
    });
    throw error;
  }
};

export const sdkSendSMS = async (to, text) => {
  try {
    const result = await messageService.sendOne({
      to,
      from: SENDER,
      text,
    });

    logger.debug("메세지 전송 성공", {
      result,
    });
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const sdkGetBalance = async () => {
  try {
    const result = await messageService.getBalance();
    logger.debug("잔액 조회 성공", {
      result,
    });
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const sdkGetMessage = async ({
  limit,
  message_id,
  message_ids,
  group_id,
  from,
  to,
  type,
  duration,
}) => {
  const params = {};
  if (limit) params.limit = limit;
  if (message_id) params.message_id = message_id;
  if (message_ids) params.message_ids = message_ids;
  if (group_id) params.group_id = group_id;
  if (from) params.from = from;
  if (to) params.to = to;
  if (type) params.type = type;
  if (duration) params.duration = duration;

  try {
    const result = await messageService.getMessages(params);
    logger.debug("메시지 조회 성공", {
      result,
    });
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const sdkGetStatistics = async ({ start_date, end_date }) => {
  const params = {
    start_date: start_date || new Date().toISOString().split("T")[0],
    end_date: end_date || new Date().toISOString().split("T")[0],
  };

  try {
    const result = await messageService.getStatistics(params);
    logger.debug("통계 조회 성공", {
      result,
    });
    return result;
  } catch (error) {
    logError(error);
    throw error;
  }
};
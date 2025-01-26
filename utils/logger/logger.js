import winston from "winston";
import "winston-mongodb"; // winston-mongodb 패키지 임포트

import fs from "fs";
import path from "path";
import config from "../../config.json" with { type: "json" };
import os from "os";

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
} = config.DATABASE.MONGODB;
const MONGO_URI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`;
const { SENDER_HOST } = config.LOGGER.TELEGRAM;

const { format } = winston;
const { combine, timestamp, errors, json, prettyPrint } = format;

// const client = new MongoClient(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// await client.connect();

const systemInfo = {
  platform: os.platform(),
  // release: os.release(),
  totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
  // freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
  cpuModel: os.cpus()[0].model,
  uptime: `${Math.floor(os.uptime() / 3600)} hours ${Math.floor((os.uptime() % 3600) / 60)} minutes`,
  hostname: os.hostname(),
  // networkInterfaces: os.networkInterfaces(),
};

const mongoTransportOptions = {
  db: MONGO_URI,
  dbName: MONGODB_DATABASE,
  level: "silly",
  collection: "peekle_logs",
  label: true,
  storeHost: true,
  tryReconnect: true,
};

// 로그 파일 디렉토리 설정
const logDirectory = "./logs/winston";
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // 디렉토리가 없으면 생성
}

// 로거 설정
const logger = winston.createLogger({
  level: "silly", // 기본 로그 레벨: 가장 낮은 수준까지 기록
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 타임스탬프 추가
    errors({ stack: true }), // 에러 스택 트레이스 추가
    json() // JSON 포맷으로 기록
  ),
  defaultMeta: {
    action: "undefined",
    actionType: "log ✨",
    service: "peekle",
    ...systemInfo,
  }, // 기본 메타데이터
  transports: [
    // MongoDB로 로그 전송
    new winston.transports.MongoDB(mongoTransportOptions),
    // 각 로그 레벨별로 JSON 파일 저장
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error", // ERROR 레벨 로그만 기록
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "warn.log"),
      level: "warn", // WARN 레벨 로그만 기록
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "info.log"),
      level: "info", // INFO 레벨 로그만 기록
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, "debug.log"),
      level: "debug", // DEBUG 레벨 로그만 기록
    }),
    // 모든 로그를 기록하는 파일
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
    // 콘솔에 JSON 형태로 출력 (개발 시 유용)
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 타임스탬프 추가
        prettyPrint({ colorize: true }) // JSON 포맷을 사람이 읽기 쉬운 형태로 콘솔 출력
      ),
    }),
    new winston.transports.Http({
      host: SENDER_HOST,
      port: 42001,
      path: "/peekle",
      method: "POST",
      json: true,
    }),
  ],
});

// 로그 레벨 설명
/**
 * 로그 레벨:
 * - error: 심각한 오류 발생 시 사용. 시스템의 작동을 중단시킬 수 있는 문제.
 * - warn: 경고 메시지. 시스템의 작동에는 영향을 주지 않지만 주의가 필요한 상황.
 * - info: 일반 정보 메시지. 시스템의 정상적인 작동 상태를 기록.
 * - debug: 디버깅 목적으로 상세한 정보를 기록.
 * - silly: 가장 낮은 수준의 로그. 매우 상세한 정보를 기록할 때 사용.
 */

export default logger;

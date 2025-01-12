import winston from "winston";
const { format } = winston;
const { combine, timestamp, printf } = format;

// 함수명 트래킹을 위한 커스텀 포맷
const customFormat = printf(({ level, message, timestamp, stack }) => {
  const functionName = stack ? stack.split("\n")[1].trim() : "N/A"; // 스택에서 함수명 추출
  return `${timestamp} [${level}] [${functionName}]: ${message}`;
});

// 로거 설정
const logger = winston.createLogger({
  level: "silly", // 기본 로그 레벨: 가장 낮은 수준의 로그까지 모두 기록
  format: combine(
    timestamp(), // 타임스탬프 추가
    winston.format.errors({ stack: true }), // 스택 트레이스 추가
    customFormat // 커스텀 포맷 적용
  ),
  transports: [
    // 각 로그 레벨별로 다른 파일에 기록
    new winston.transports.File({
      filename: "./logs/error.winston.log",
      level: "error", // ERROR 레벨 로그만 기록
    }),
    new winston.transports.File({
      filename: "./logs/warn.winston.log",
      level: "warn", // WARN 레벨 로그만 기록
    }),
    new winston.transports.File({
      filename: "./logs/info.winston.log",
      level: "info", // INFO 레벨 로그만 기록
    }),
    new winston.transports.File({
      filename: "./logs/debug.winston.log",
      level: "debug", // DEBUG 레벨 로그만 기록
    }),
    // 모든 로그를 기록하는 파일
    new winston.transports.File({
      filename: "./logs/combined.winston.log",
    }),
    // 콘솔에 모든 로그 출력
    new winston.transports.Console({
      format: combine(
        timestamp(),
        winston.format.colorize(), // 콘솔 로그에 색상 추가
        customFormat
      ),
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

export default logger; // 다른 모듈에서 사용 가능하도록 내보내기

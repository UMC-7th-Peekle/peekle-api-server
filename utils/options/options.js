import fs from "fs";
import config from "../../config/config.json" with { type: "json" };
import logger from "../logger/logger.js";
const { ENV, SERVER_DOMAIN } = config.SERVER;

export const corsOptions = {
  origin: config.SERVER.CORS.ORIGIN, // CORS domain 설정
  // origin: "*", // CORS domain 설정
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // 허용할 HTTP 메서드
  // allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
  optionsSuccessStatus: 204, // Preflight 응답 상태 코드 (IE 호환성 이슈 방지)
};

// SSL 인증서 로드
export const sslOptions = {
  // key: config.PEM.KEY, // 개인 키 파일
  // cert: config.PEM.CERT, // 인증서 파일
  key: fs.readFileSync("./config/key.pem"), // 개인 키 파일
  cert: fs.readFileSync("./config/cert.pem"), // 인증서 파일
};

export const refreshTokenCookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  sameSite: "none",
  secure: true,
  domain: SERVER_DOMAIN, // 백엔드 도메인
  path: "/",
};

/*
  :method: HTTP 요청 메서드 (예: GET, POST)
  :url: 요청된 URL
  :status: HTTP 응답 상태 코드 (예: 200, 404)
  :res[content-length]: 응답의 콘텐츠 길이 (바이트 단위)
  :response-time: 요청을 처리하는 데 걸린 시간 (밀리초 단위)
  :date[clf]: 로그 항목의 날짜와 시간 (Common Log Format)
  :referrer: 요청의 참조 URL (어디서 요청이 왔는지)
  :user-agent: 클라이언트의 사용자 에이전트 문자열 (브라우저 정보 등)
*/

// export const morganFormat = (tokens, req, res) => {
//   return JSON.stringify({
//     requestInfo: `${tokens["remote-addr"](req, res)} | ${tokens["remote-user"](req, res)} | ${tokens["user-agent"](req, res)} | ${tokens.referrer(req, res)} | ${tokens.date(req, res, "clf")}`,
//     request: `${tokens.method(req, res)} ${tokens.url(req, res)} ${tokens.status(req, res)} - ${tokens.res(req, res, "content-length")} HTTP ${tokens["http-version"](req, res)}`,
//     responseTime: `${tokens["response-time"](req, res)} ms`,
//   });
// };

export const morganFormat = (tokens, req, res) => {
  let requestData = null;
  if (ENV === "development") {
    requestData = {
      cookies: req.cookies,
      body: req.body,
      contentType: req.headers["content-type"],
      headers: req.headers,
      params: req.params,
      query: req.query,
    };
  }
  return JSON.stringify({
    clientInfo: {
      ip: tokens["remote-addr"](req, res),
      user: tokens["remote-user"](req, res) || null,
      userAgent: tokens["user-agent"](req, res),
      referrer: tokens.referrer(req, res) || null,
      date: tokens.date(req, res, "clf"),
    },
    requestDetails: {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)), // 상태 코드를 숫자로 변환
      responseTime: `${tokens["response-time"](req, res)} ms`,
      contentLength: Number(tokens.res(req, res, "content-length")) || 0, // 기본값 처리
      httpVersion: tokens["http-version"](req, res),
      transactionId: req.transactionId,
      requestData,
    },
  });
};

export const morgranOptions = {
  stream: {
    write: (message) => {
      logger.http("MORGAN_REQUEST_INFO", {
        action: "REQUEST",
        data: JSON.parse(message),
      });
    },
  },
};

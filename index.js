// Written by Kyeoung Woon Park https://github.com/kyeoungwoon
// Template Repository: https://github.com/kyeoungwoon/nodejs-api-server-template

// npm 패키지 import
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
// import http from "http";
import https from "https"; // https를 사용해야 하는 경우 사용하면 됩니다.
// import { Server } from "socket.io"; // socket을 사용하려면 주석 해제

// 로컬 module import, 기능별로 구분해주세요.
import logger from "./utils/logger/logger.js";
import {
  corsOptions,
  sslOptions,
  morganFormat,
  morgranOptions,
} from "./utils/options/options.js";

import config from "./config.json" with { type: "json" };
const PORT = config.SERVER.PORT;

import {
  errorHandler,
  responseHandler,
} from "./utils/handlers/response.handlers.js";

import swaggerUi from "swagger-ui-express";

// Router import , /routes/index.js에서 Router들을 1차적으로 모아서 export 합니다.
import routers from "./routes/index.js";
import swaggerOptions from "./routes/swagger.index.js";
import path from "path";

// __dirname을 사용하기 위한 설정
// static file을 serve하기 위해 사용합니다.
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Socket.io Router는 이 주석 아래에 import 해주시면 됩니다.
// ex) const exampleSocketRouter = require("./routes/example.socket.router"); // commonJS
// ex) import exampleSocketRouter from "./routes/example.socket.router"; // ES6

// ** 중요 ** 미들웨어 순서를 변경할 때는 신경써서 작업해 주세요.
const app = express();

app.use(responseHandler);
app.use((req, res, next) => {
  req.transactionId = uuidv4(); // 고유한 트랜잭션 ID 생성
  next();
});

app.use(cookieParser());
app.use(cors(corsOptions));
// Preflight 요청 수동 처리 (필요한 경우)
// app.options("*", cors(corsOptions));

app.use(morgan(morganFormat, morgranOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger 설정
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
app.use(
  "/docs",
  (req, res, next) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions)
);

// Router 연결
app.use("/", routers);

// 에러 핸들러는 최하단에 위치해야 하는 미들웨어입니다. 절대 순서를 변경하지 마세요.
app.use(errorHandler);

// http, https 사용하실 프로토콜에 맞추어 주석 해제하고 사용하시면 됩니다.
const server = https.createServer(sslOptions, app);
// const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`SEVER LISTENING TO PORT ${PORT}`, {
    action: "server:start",
  });
});

// 상단에 socket.io import 주석을 해제하고 사용하시면 됩니다.

// const io = new Server(server, {
//   cors: corsOptions,
//   // CORS option은 HTTP 서버와 공유합니다.
//   // 따로 설정하시려면 다시 작성하시면 됩니다.
//   cookie: true,
// });

// 하단에 Socket.io Router를 추가하면 됩니다.
// ex)
// const exampleSocket = io.of("/example");
// exapmpleSocketRouter(exampleSocket);

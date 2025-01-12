// Written by Kyeoung Woon Park https://github.com/kyeoungwoon

// npm 패키지 import
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "node:path";
import http from "http";
// import https from "https"; // https를 사용해야 하는 경우 사용하면 됩니다.
// import { Server } from "socket.io"; // socket을 사용하려면 주석 해제

// 로컬 module import, 기능별로 구분해주세요.
import logger from "./utils/logger/logger.js";
import { corsOptions /*, sslOptions */ } from "./utils/options/options.js";

import config from "./config.json" with { type: "json" };
const PORT = config.SERVER.PORT;

import {
  errorHandler,
  responseHandler,
} from "./utils/handlers/response.handlers.js";

import swaggerUi from "swagger-ui-express";
import { specs } from "./utils/swagger/swagger.js";
//import { corsOptions /*, sslOptions */ } from "./options";

// Routers는 이 주석 아래에 import 해주시면 됩니다.
// ex) const exampleRouter = require("./routers/example.router"); // commonJS
// ex) import * as exampleRouter from "./routers/example.router"; // ES6
import adminRouter from "./routers/admin.router.js";
import authRouter from "./routers/auth.router.js";
import communityRouter from "./routers/community.router.js";
import eventsRouter from "./routers/events.router.js";
import noticesRouter from "./routers/notices.router.js";
import ticketsRouter from "./routers/tickets.router.js";
import usersRouter from "./routers/users.router.js";

// Socket.io Router는 이 주석 아래에 import 해주시면 됩니다.
// ex) const exampleSocketRouter = require("./routes/example.socket.router"); // commonJS
// ex) import * as exampleSocketRouter from "./routes/example.socket.router"; // ES6

// ** 중요 ** 미들웨어 순서를 변경할 때는 신경써서 작업해 주세요.
const app = express();

app.use(responseHandler);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Swagger 설정
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 이 주석 하단에 Router들을 use 해주시면 됩니다.
// ex) app.use("/example", exampleRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/community", communityRouter);
app.use("/events", eventsRouter);
app.use("/notices", noticesRouter);
app.use("/tickets", ticketsRouter);
app.use("/users", usersRouter);

// 에러 핸들러는 최하단에 위치해야 하는 미들웨어입니다. 절대 순서를 변경하지 마세요.
app.use(errorHandler);

// http, https 사용하실 프로토콜에 맞추어 주석 해제하고 사용하시면 됩니다.
// const server = https.createServer(sslOptions, app);
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server is running on PORT ${PORT}`);
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

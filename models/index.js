import { Sequelize } from "sequelize";
import initModels from "./database/init-models.js";
import logger from "../utils/logger/logger.js";
import config from "../config.json" with { type: "json" };
import { format } from "sql-formatter";

const DATABASE = config.DATABASE;

const sequelize = new Sequelize(
  DATABASE.MYSQL_DATABASE,
  DATABASE.MYSQL_USER,
  DATABASE.MYSQL_PASSWORD,
  {
    host: DATABASE.MYSQL_HOST,
    port: DATABASE.MYSQL_PORT,
    dialect: "mysql",
    benchmark: true,
    logging: (msg, timing) => {
      // const isTransaction = msg.startsWith("Executing (default): BEGIN;");
      // const parsedMsg = msg.replace(/^Executing \(default\):/, "").trim();
      // ANSI escape codes:
      const reset = "\x1b[0m"; // 리셋 (색상 및 스타일 초기화)

      const green = "\x1b[32m\x1b[1m"; // 초록색, 볼드
      const cyan = "\x1b[36m\x1b[1m"; // 청록색, 볼드
      const magenta = "\x1b[35m\x1b[1m"; // 자홍색, 볼드
      // const white = "\x1b[37m\x1b[1m";
      // const yellow = "\x1b[33m\x1b[1m"; // 노란색, 볼드
      // const blue = "\x1b[34m\x1b[1m"; // 파란색, 볼드
      // const red = "\x1b[31m\x1b[1m"; // 빨간색, 볼드
      // const black = "\x1b[30m\x1b[1m"; // 검정색, 볼드

      const parsedMsg = msg.split(":").slice(1).join(":").trim();
      let formattedMsg = msg;
      try {
        formattedMsg = format(parsedMsg, {
          language: "mysql",
          indent: "  ",
          uppercase: true,
          linesBetweenQueries: 2,
        });
        formattedMsg = formattedMsg.trim();
      } catch (err) {
        console.error(err);
      }
      logger.silly(formattedMsg, {
        action: "sequelize:query",
        actionType: "log ✨",
        queryTime: `${timing} ms`,
      });

      // 콘솔 로그에 스타일 적용
      if (config.SERVER.ENV === "development") {
        const slicedMsg =
          formattedMsg.length > 100
            ? formattedMsg.substring(0, 100) + "..."
            : formattedMsg;
        console.log(
          `${cyan}⏱️  Execution Time: ${green}${timing} ms${reset}\n${magenta}💬 Query: ${reset}${formattedMsg}${reset}`
        );
      }
      return;
    },
    // timezone: "+09:00",
    pool: {
      max: 10, // 최대 연결 수
      min: 0, // 최소 연결 수
      acquire: 30000, // 연결을 가져오는 최대 시간 (ms)
      idle: 10000, // 연결이 유휴 상태일 때 종료되기까지의 시간 (ms)
    },
  }
);

const models = initModels(sequelize);
models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;

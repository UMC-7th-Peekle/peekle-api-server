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
    logging: (msg) =>
      logger.debug(
        format(msg.replace(/^Executing \(default\):/, "").trim(), {
          language: "mysql",
          indent: "  ",
          uppercase: true,
          linesBetweenQueries: 2,
        }),
        {
          action: "sequelize:query",
          actionType: "log ✨",
        }
      ),
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

# 📁 models/index.js

Sequlize 객체를 정의하고, `models/database` 폴더에 정의된 모델들을 불러모아 연관성 부여 등 작업을 하는 파일입니다. 📂

프로젝트 내 파일에서는 이 파일을 import 해서 DB 객체에 접근합니다. 📥

`const { User } = require("../models);` 과 같이 사용합니다. 💻

`index.js` 예시 ✨
```js
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const logger = require("../logger");
const dbConfig = require("../config.json").DATABASE;

const sequelize = new Sequelize(
  dbConfig.MYSQL_DATABASE,
  dbConfig.MYSQL_USER,
  dbConfig.MYSQL_PASSWORD,
  {
    host: dbConfig.MYSQL_HOST,
    port: dbConfig.MYSQL_PORT,
    dialect: "mysql",
    logging: (msg) => logger.debug(`[Sequelize ✨]\n${msg} ✨`),
    timezone: "+09:00",
    pool: {
      max: 10, // 최대 연결 수
      min: 0, // 최소 연결 수
      acquire: 30000, // 연결을 가져오는 최대 시간 (ms)
      idle: 10000, // 연결이 유휴 상태일 때 종료되기까지의 시간 (ms)
    },
  }
);

const db = {};
logger.info("모델 갯수 :", Object.keys(db).length);

const modelsDir = path.join(__dirname, "define");
const modelFiles = fs.readdirSync(modelsDir);
modelFiles.filter((file) => { return (file.slice(-3) === ".js" && !file.startsWith(".") && !file.endsWith(".test.js")); })
  .forEach((file) => { const model = require(path.join(modelsDir, file)); model.init(sequelize); db[model.name] = model; });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].init) {
    db[modelName].init(sequelize);
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```
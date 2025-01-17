const SequelizeAuto = require("sequelize-auto");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const config = require("../config.json").DATABASE;

const auto = new SequelizeAuto(
  config.MYSQL_DATABASE,
  config.MYSQL_USER,
  config.MYSQL_PASSWORD,
  {
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    dialect: "mysql",
    directory: "./models/database", // where to write files
    additional: {
      timestamps: false,
    },
    lang: "esm", // the lang for the generated models
    indentation: 2,
    caseModel: "p", // 'c' for camelCase, 'p' for pascal
    caseProp: "c", // 'c' for camelCase, 'o' for original
    caseFile: "p", // 'c' for camelCase, 'l' for lower, 'p' for pascal
    // camelCase: true, // convert snake_case column names to camelCase field names: user_id -> userId
    // noAlias: true // as 별칭 미설정 여부
  }
);

async function processFiles() {
  const modelsDir = path.resolve(__dirname, "./database");
  const files = fs.readdirSync(modelsDir);

  console.log("모델 디렉토리:", modelsDir);
  console.log("처리할 파일들:", files);

  for (const file of files) {
    if (file.endsWith(".js")) {
      const filePath = path.join(modelsDir, file);
      try {
        let content = await readFile(filePath, "utf8");
        const originalContent = content;
        content = content.replace(
          /defaultValue:\s*["']CURRENT_TIMESTAMP\(6\)["']/g,
          'defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)")'
        );
        if (originalContent !== content) {
          console.log(`파일 ${file}에서 defaultValue가 변경되었습니다.`);
        }
        await writeFile(filePath, content, "utf8");
        console.log(`파일 수정 완료: ${file}`);
      } catch (error) {
        console.error(`파일 처리 중 오류 발생: ${file}`, error);
      }
    }
  }
  console.log("모든 파일 처리 완료");
}

auto
  .run()
  .then(() => {
    console.log("모델 생성 완료 ✨".repeat(20));
    return processFiles();
  })
  .catch((err) => {
    console.error("Error running SequelizeAuto:", err);
  });

const SequelizeAuto = require("sequelize-auto");

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
    //noAlias: true // as 별칭 미설정 여부
  }
);
auto.run((err) => {
  if (err) throw err;
});

# 📁 models/index.js

Sequlize 객체를 정의하고, `models/database` 폴더에 정의된 모델들을 불러모아 연관성 부여 등 작업을 하는 파일입니다. 📂

프로젝트 내 파일에서는 이 파일을 import 해서 DB 객체에 접근합니다. 📥

아래 예시와 같이 사용 가능합니다. 💻

```js
import db from "../../models/index.js";

const { Users } = db;

export const getUser = async () => {
  try {
    const user = await Users.findAll();
    return user;
  } catch (error) {
    throw error;
  }
};

getUser().then((res) => console.log(res));
```

`index.js` 예시 ✨

```js
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const logger = require("../logger");
const dbConfig = require("./config.json").DATABASE;

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
modelFiles
  .filter((file) => {
    return (
      file.slice(-3) === ".js" &&
      !file.startsWith(".") &&
      !file.endsWith(".test.js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsDir, file));
    model.init(sequelize);
    db[model.name] = model;
  });

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

# 📚 models/database

Sequelize로 DB 모델을 정의하는 곳입니다.  
아래와 같이, class를 활용한 방식으로 작성하시면 됩니다.  
DB에 있는 모든 값과, FK들을 모두 명시해야 추후 include 사용 시 문제가 발생하지 않습니다.

```js
const { DataTypes, Model, Sequelize } = require("sequelize");
class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        nickname_changes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        birthdate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        is_email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_email_public: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        profile_image: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(512),
          allowNull: false,
          defaultValue: "",
        },
        website: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          defaultValue: "",
        },
        is_premium_user: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        spec_level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        manner_score: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 5000,
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
          onUpdate: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Admin, {
      as: "admins",
      foreignKey: "user_id",
    });
    this.hasMany(models.Event, {
      as: "events",
      foreignKey: "host_id",
    });
    this.hasMany(models.Inquiry, {
      as: "inquiries",
      foreignKey: "user_id",
      sourceKey: "user_id",
    });
    this.hasMany(models.InquiryAnswer, {
      as: "inquiry_answers",
      foreignKey: "admin_id",
      sourceKey: "user_id",
    });
    this.hasMany(models.Notice, {
      as: "notices",
      foreignKey: "author_id",
    });
    // this.hasMany(models.OrganizationUser, {
    //   as: "organization_users",
    //   foreignKey: "user_id",
    // });
    this.hasOne(models.OrganizationUser, {
      as: "organization_user",
      foreignKey: "user_id",
    });
    this.hasMany(models.Spec, {
      as: "specs",
      foreignKey: "user_id",
    });
    this.hasMany(models.StudyroomChat, {
      as: "studyroom_chats",
      foreignKey: "sender_id",
    });
    this.hasMany(models.StudyroomInvite, {
      as: "studyroom_invites_sent",
      foreignKey: "inviter_id",
    });
    this.hasMany(models.StudyroomInvite, {
      as: "studyroom_invites_received",
      foreignKey: "invitee_id",
    });
    this.hasMany(models.StudyroomMember, {
      as: "studyroom_members",
      foreignKey: "user_id",
    });
    this.hasMany(models.Todo, {
      as: "todos",
      foreignKey: "creater_id",
    });
    this.hasMany(models.TodoParticipant, {
      as: "todo_participants",
      foreignKey: "assigned_user_id",
    });
    this.hasMany(models.UserArea, {
      as: "user_areas",
      foreignKey: "user_id",
    });
    this.hasOne(models.UserLocal, {
      as: "user_local",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserOauth, {
      as: "user_oauths",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserRefreshToken, {
      as: "user_refresh_tokens",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserSpec, {
      as: "user_specs",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserStudyroom, {
      as: "user_studyrooms",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserTerm, {
      as: "user_terms",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserTodo, {
      as: "user_todos",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserPayments, {
      as: "user_payments",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserPremium, {
      as: "user_premium",
      foreignKey: "user_id",
    });
    this.hasMany(models.UserSchool, {
      as: "user_schools",
      foreignKey: "user_id",
    });
  }
}

module.exports = User;
```

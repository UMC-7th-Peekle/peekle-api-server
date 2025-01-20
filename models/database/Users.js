import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Users extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'user_id'
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: "users_pk_2"
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male','female'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "users_pk"
    },
    lastNicknameChangeDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'last_nickname_change_date'
    },
    profileImage: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      field: 'profile_image'
    },
    status: {
      type: DataTypes.ENUM('active','dormant','terminated'),
      allowNull: false,
      defaultValue: "active"
    },
    lastActivityDate: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      field: 'last_activity_date'
    },
    dormantDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'dormant_date'
    },
    terminationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'termination_date'
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "users_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "users_pk_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nickname" },
        ]
      },
    ]
  });
  }
}

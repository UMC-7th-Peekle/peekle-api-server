import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserOauth extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userOauthId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'user_oauth_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    oauthId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'oauth_id'
    },
    oauthType: {
      type: DataTypes.ENUM('kakao'),
      allowNull: false,
      field: 'oauth_type'
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
    tableName: 'user_oauth',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_oauth_id" },
        ]
      },
      {
        name: "user_oauth_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "oauth_id" },
          { name: "oauth_type" },
        ]
      },
      {
        name: "user_oauth_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}

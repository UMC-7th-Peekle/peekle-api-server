import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserOauth extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    oauthId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'oauth_id'
    },
    oauthType: {
      type: DataTypes.ENUM('kakao','google','naver'),
      allowNull: false,
      primaryKey: true,
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
          { name: "user_id" },
          { name: "oauth_type" },
          { name: "oauth_id" },
        ]
      },
    ]
  });
  }
}

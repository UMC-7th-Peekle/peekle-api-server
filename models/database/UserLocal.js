import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class UserLocal extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "users",
            key: "user_id",
          },
          field: "user_id",
        },
        password: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "user_local",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "user_id" }],
          },
        ],
      }
    );
  }
}

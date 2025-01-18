import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class Communities extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        communityId: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: "community_id",
        },
        title: {
          type: DataTypes.STRING(512),
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
        tableName: "communities",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "community_id" }],
          },
        ],
      }
    );
  }
}

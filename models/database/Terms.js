import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class Terms extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        termId: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: "term_id",
        },
        title: {
          type: DataTypes.STRING(512),
          allowNull: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isRequired: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: "is_required",
        },
        status: {
          type: DataTypes.ENUM("active", "inactive", "pending"),
          allowNull: false,
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
        tableName: "terms",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "term_id" }],
          },
        ],
      }
    );
  }
}

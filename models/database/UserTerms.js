import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class UserTerms extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        userTermsId: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: "user_terms_id",
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "users",
            key: "user_id",
          },
          field: "user_id",
        },
        termId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "terms",
            key: "term_id",
          },
          field: "term_id",
        },
        isAgreed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: "is_agreed",
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
        tableName: "user_terms",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "user_terms_id" }],
          },
          {
            name: "user_terms_terms_term_id_fk",
            using: "BTREE",
            fields: [{ name: "term_id" }],
          },
          {
            name: "user_terms_users_user_id_fk",
            using: "BTREE",
            fields: [{ name: "user_id" }],
          },
        ],
      }
    );
  }
}

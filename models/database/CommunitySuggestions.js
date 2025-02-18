import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class CommunitySuggestions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    suggestionId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'suggestion_id'
    },
    authorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'author_id'
    },
    title: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'community_suggestions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "suggestion_id" },
        ]
      },
      {
        name: "community_suggestions_user_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
  }
}

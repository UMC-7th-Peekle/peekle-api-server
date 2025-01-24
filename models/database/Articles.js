import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Articles extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    articleId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'article_id'
    },
    title: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    authorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'author_id'
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_anonymous'
    },
    communityId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'communities',
        key: 'community_id'
      },
      field: 'community_id'
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
    tableName: 'articles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "article_id" },
        ]
      },
      {
        name: "articles_communities_community_id_fk",
        using: "BTREE",
        fields: [
          { name: "community_id" },
        ]
      },
      {
        name: "community_article_user_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
  }
}

import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArticleComments extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    commentId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'comment_id'
    },
    articleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'article_id'
      },
      field: 'article_id'
    },
    parentCommentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'article_comments',
        key: 'comment_id'
      },
      field: 'parent_comment_id'
    },
    status: {
      type: DataTypes.ENUM('active','deleted','reported'),
      allowNull: false
    },
    authorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'author_id'
    },
    comment: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)",
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)",
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'article_comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comment_id" },
        ]
      },
      {
        name: "article_comments_article_comments_comment_id_fk",
        using: "BTREE",
        fields: [
          { name: "parent_comment_id" },
        ]
      },
      {
        name: "article_comments_articles_article_id_fk",
        using: "BTREE",
        fields: [
          { name: "article_id" },
        ]
      },
      {
        name: "article_comments_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
  }
}

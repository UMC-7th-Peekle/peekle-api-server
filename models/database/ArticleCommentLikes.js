import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArticleCommentLikes extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    likeId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'like_id'
    },
    commentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'article_comments',
        key: 'comment_id'
      },
      field: 'comment_id'
    },
    likedUserId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'liked_user_id'
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
    tableName: 'article_comment_likes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "like_id" },
        ]
      },
      {
        name: "article_comment_likes_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comment_id" },
          { name: "liked_user_id" },
        ]
      },
      {
        name: "article_comment_likes_article_comments_comment_id_fk",
        using: "BTREE",
        fields: [
          { name: "comment_id" },
        ]
      },
      {
        name: "article_comment_likes_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "liked_user_id" },
        ]
      },
    ]
  });
  }
}

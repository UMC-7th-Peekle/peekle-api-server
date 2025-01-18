import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArticleLikes extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    articleLikesId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'article_likes_id'
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
    likedUserId: {
      type: DataTypes.BIGINT,
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
    tableName: 'article_likes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "article_likes_id" },
        ]
      },
      {
        name: "article_likes_articles_article_id_fk",
        using: "BTREE",
        fields: [
          { name: "article_id" },
        ]
      },
      {
        name: "article_likes_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "liked_user_id" },
        ]
      },
    ]
  });
  }
}

import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ArticleImages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    articleImageId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'article_image_id'
    },
    articleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'article_id'
      },
      field: 'article_id'
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: "article_images_pk",
      field: 'image_url'
    },
    sequence: {
      type: DataTypes.INTEGER,
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
    tableName: 'article_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "article_image_id" },
        ]
      },
      {
        name: "article_images_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_url" },
        ]
      },
      {
        name: "article_images_articles_article_id_fk",
        using: "BTREE",
        fields: [
          { name: "article_id" },
        ]
      },
    ]
  });
  }
}

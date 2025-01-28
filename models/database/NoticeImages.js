import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class NoticeImages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    imageId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'image_id'
    },
    noticeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'notices',
        key: 'notice_id'
      },
      field: 'notice_id'
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: "notice_images_pk",
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
    tableName: 'notice_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
      {
        name: "notice_images_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_url" },
        ]
      },
      {
        name: "notice_images_notices_notice_id_fk",
        using: "BTREE",
        fields: [
          { name: "notice_id" },
        ]
      },
    ]
  });
  }
}

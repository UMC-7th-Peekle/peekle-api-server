import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ChatImages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    chatId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chats',
        key: 'chat_id'
      },
      field: 'chat_id'
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
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
    tableName: 'chat_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chat_id" },
        ]
      },
    ]
  });
  }
}

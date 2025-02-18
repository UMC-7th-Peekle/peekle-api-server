import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Chats extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    chatId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'chat_id'
    },
    chatroomId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'chatroom',
        key: 'chatroom_id'
      },
      field: 'chatroom_id'
    },
    parentChatId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'parent_chat_id'
    },
    status: {
      type: DataTypes.ENUM('active','edited','deleted'),
      allowNull: false,
      defaultValue: "active"
    },
    authorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'author_id'
    },
    type: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: true
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
    tableName: 'chats',
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
      {
        name: "chats_chatroom_chatroom_id_fk2",
        using: "BTREE",
        fields: [
          { name: "chatroom_id" },
        ]
      },
    ]
  });
  }
}

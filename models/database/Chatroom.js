import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Chatroom extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    chatroomId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'chatroom_id'
    },
    senderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'sender_id'
    },
    receiverId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'receiver_id'
    },
    isSenderAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_sender_anonymous'
    },
    isReceiverAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_receiver_anonymous'
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    noticeChatId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'chats',
        key: 'chat_id'
      },
      field: 'notice_chat_id'
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
    tableName: 'chatroom',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chatroom_id" },
        ]
      },
      {
        name: "chatroom_chats_chat_id_fk",
        using: "BTREE",
        fields: [
          { name: "notice_chat_id" },
        ]
      },
      {
        name: "chatroom_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "sender_id" },
        ]
      },
      {
        name: "chatroom_users_user_id_fk_2",
        using: "BTREE",
        fields: [
          { name: "receiver_id" },
        ]
      },
    ]
  });
  }
}

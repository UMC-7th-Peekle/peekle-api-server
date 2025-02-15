import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PeeklingChatroom extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    peeklingId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'peekling',
        key: 'peekling_id'
      },
      field: 'peekling_id'
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    noticeChatId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
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
    tableName: 'peekling_chatroom',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "peekling_id" },
        ]
      },
      {
        name: "peekling_chatroom_chats_chat_id_fk",
        using: "BTREE",
        fields: [
          { name: "notice_chat_id" },
        ]
      },
    ]
  });
  }
}

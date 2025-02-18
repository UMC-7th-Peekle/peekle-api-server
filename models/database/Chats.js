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
    parentChatId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'chats',
        key: 'chat_id'
      },
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
      references: {
        model: 'users',
        key: 'user_id'
      },
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
        name: "chats_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
      {
        name: "chats_chats_chat_id_fk",
        using: "BTREE",
        fields: [
          { name: "parent_chat_id" },
        ]
      },
    ]
  });
  }
}

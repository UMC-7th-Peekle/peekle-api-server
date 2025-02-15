import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PeeklingParticipants extends Model {
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
    participantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'participant_id'
    },
    status: {
      type: DataTypes.ENUM('active','canceled','kicked'),
      allowNull: false,
      defaultValue: "active"
    },
    isInChatroom: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      field: 'is_in_chatroom'
    },
    cancelReason: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'cancel_reason'
    },
    kickReason: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'kick_reason'
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
    tableName: 'peekling_participants',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "peekling_id" },
          { name: "participant_id" },
        ]
      },
      {
        name: "peekling_participants_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "participant_id" },
        ]
      },
    ]
  });
  }
}

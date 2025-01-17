import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class TicketMessages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ticketMessageId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'ticket_message_id'
    },
    ticketId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tickets',
        key: 'ticket_id'
      },
      field: 'ticket_id'
    },
    title: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'created_by'
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
    tableName: 'ticket_messages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ticket_message_id" },
        ]
      },
      {
        name: "ticket_messages_tickets_ticket_id_fk",
        using: "BTREE",
        fields: [
          { name: "ticket_id" },
        ]
      },
      {
        name: "ticket_messages_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
    ]
  });
  }
}

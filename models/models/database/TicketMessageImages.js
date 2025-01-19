import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class TicketMessageImages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    imageId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'image_id'
    },
    ticketMessageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ticket_messages',
        key: 'ticket_message_id'
      },
      field: 'ticket_message_id'
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
      defaultValue: "CURRENT_TIMESTAMP(6)",
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)",
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'ticket_message_images',
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
        name: "ticket_message_images_ticket_messages_ticket_message_id_fk",
        using: "BTREE",
        fields: [
          { name: "ticket_message_id" },
        ]
      },
    ]
  });
  }
}

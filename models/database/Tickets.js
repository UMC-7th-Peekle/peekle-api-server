import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Tickets extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ticketId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'ticket_id'
    },
    title: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open','closed','in_progress'),
      allowNull: false
    },
    createdUserId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'created_user_id'
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
    tableName: 'tickets',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ticket_id" },
        ]
      },
      {
        name: "tickets_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "created_user_id" },
        ]
      },
    ]
  });
  }
}

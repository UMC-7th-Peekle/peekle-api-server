import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Logs extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    logId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'log_id'
    },
    actionType: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: 'action_type'
    },
    action: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      field: 'created_at'
    }
  }, {
    sequelize,
    tableName: 'logs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "log_id" },
        ]
      },
      {
        name: "logs_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}

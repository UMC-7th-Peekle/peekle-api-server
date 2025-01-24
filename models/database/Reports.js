import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Reports extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    reportId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'report_id'
    },
    type: {
      type: DataTypes.ENUM('user','article','comment','event'),
      allowNull: false
    },
    targetId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'target_id'
    },
    reportedUserId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'reported_user_id'
    },
    reason: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open','pending','closed'),
      allowNull: false,
      defaultValue: "open"
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
    tableName: 'reports',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "report_id" },
        ]
      },
      {
        name: "reports_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "target_id" },
          { name: "type" },
          { name: "reported_user_id" },
        ]
      },
      {
        name: "reports_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "reported_user_id" },
        ]
      },
    ]
  });
  }
}

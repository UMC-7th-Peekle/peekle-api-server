import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserRestrictions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userRestrictionId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'user_restriction_id'
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    adminUserId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'admin_user_id'
    },
    type: {
      type: DataTypes.ENUM('suspend','ban','canceled','expired'),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    endsAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'ends_at'
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
    tableName: 'user_restrictions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_restriction_id" },
        ]
      },
      {
        name: "user_restrictions_users_user_id_fk_2",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_restrictions_admins_admin_id_fk",
        using: "BTREE",
        fields: [
          { name: "admin_user_id" },
        ]
      },
    ]
  });
  }
}

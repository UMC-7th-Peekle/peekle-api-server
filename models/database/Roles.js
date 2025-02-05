import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Roles extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    roleId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'role_id'
    },
    parentRoleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      },
      field: 'parent_role_id'
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
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
    tableName: 'roles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
      {
        name: "roles_roles_role_id_fk",
        using: "BTREE",
        fields: [
          { name: "parent_role_id" },
        ]
      },
    ]
  });
  }
}

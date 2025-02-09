import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class RoleHierarchy extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    parentRoleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'role_id'
      },
      field: 'parent_role_id'
    },
    childRoleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'role_id'
      },
      field: 'child_role_id'
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
    tableName: 'role_hierarchy',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "parent_role_id" },
          { name: "child_role_id" },
        ]
      },
      {
        name: "role_hierarchy_roles_role_id_fk",
        using: "BTREE",
        fields: [
          { name: "child_role_id" },
        ]
      },
    ]
  });
  }
}

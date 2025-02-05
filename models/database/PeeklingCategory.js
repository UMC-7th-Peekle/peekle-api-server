import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PeeklingCategory extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    categoryId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'category_id'
    },
    name: {
      type: DataTypes.STRING(50),
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
    tableName: 'peekling_category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
  }
}

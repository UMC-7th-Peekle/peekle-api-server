import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PeeklingSave extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    minPeople: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'min_people'
    },
    maxPeople: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_people'
    },
    schedule: {
      type: DataTypes.DATE,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'peekling_category',
        key: 'category_id'
      },
      field: 'category_id'
    },
    createdUserId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
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
    tableName: 'peekling_save',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "peekling_save_peekling_category_category_id_fk",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "peekling_save_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "created_user_id" },
        ]
      },
    ]
  });
  }
}

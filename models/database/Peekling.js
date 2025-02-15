import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Peekling extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    peeklingId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'peekling_id'
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active','canceled','completed'),
      allowNull: false,
      defaultValue: "active"
    },
    minPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'min_people'
    },
    maxPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'max_people'
    },
    schedule: {
      type: DataTypes.DATE,
      allowNull: false
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
    tableName: 'peekling',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "peekling_id" },
        ]
      },
      {
        name: "peekling_peekling_category_category_id_fk",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "peekling_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "created_user_id" },
        ]
      },
    ]
  });
  }
}

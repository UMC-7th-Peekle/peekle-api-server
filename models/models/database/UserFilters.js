import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserFilters extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    userFilterId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'user_filter_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    dateAscending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      field: 'date_ascending'
    },
    priceAscending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      field: 'price_ascending'
    },
    distanceAscending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      field: 'distance_ascending'
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "bitwise_operation"
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
    tableName: 'user_filters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_filter_id" },
        ]
      },
      {
        name: "user_filters_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}

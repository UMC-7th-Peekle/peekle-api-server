import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Events extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    eventId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'event_id'
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'event_category',
        key: 'category_id'
      },
      field: 'category_id'
    },
    location: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    eventUrl: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      field: 'event_url'
    },
    applicationStart: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'application_start'
    },
    applicationEnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'application_end'
    },
    createdUserId: {
      type: DataTypes.BIGINT,
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
    tableName: 'events',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "events_event_category_category_id_fk",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "events_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "created_user_id" },
        ]
      },
    ]
  });
  }
}

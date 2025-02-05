import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EventScraps extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    eventScrapId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'event_scrap_id'
    },
    eventId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'events',
        key: 'event_id'
      },
      field: 'event_id'
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
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'event_scraps',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "event_scrap_id" },
        ]
      },
      {
        name: "event_scraps_pk",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "event_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "event_scraps_pk_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "event_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "event_scrap_events_event_id_fk",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "event_scrap_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}

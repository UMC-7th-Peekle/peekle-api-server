import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EventLocation extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    eventLocationId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'event_location_id'
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
    position: {
      type: DataTypes.GEOMETRY,
      allowNull: false
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
    tableName: 'event_location',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "event_location_id" },
        ]
      },
      {
        name: "event_id",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
    ]
  });
  }
}

import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EventLocation extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    eventId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'events',
        key: 'event_id'
      },
      field: 'event_id'
    },
    locationGroupId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'event_location_groups',
        key: 'group_id'
      },
      field: 'location_group_id'
    },
    position: {
      type: DataTypes.GEOMETRY,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    buildingName: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'building_name'
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
          { name: "event_id" },
        ]
      },
      {
        name: "event_id",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "event_location_event_location_groups_group_id_fk",
        using: "BTREE",
        fields: [
          { name: "location_group_id" },
        ]
      },
    ]
  });
  }
}

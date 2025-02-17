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
      allowNull: false,
      references: {
        model: 'event_location_groups',
        key: 'group_id'
      },
      field: 'location_group_id'
    },
    position: {
      type: DataTypes.GEOMETRY,
      allowNull: false
    },
    roadAddress: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      field: 'road_address'
    },
    jibunAddress: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      field: 'jibun_address'
    },
    buildingCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'building_code'
    },
    buildingName: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      field: 'building_name'
    },
    sido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sigungu: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sigunguCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'sigungu_code'
    },
    roadnameCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'roadname_code'
    },
    zoneCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'zone_code'
    },
    detail: {
      type: DataTypes.STRING(200),
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

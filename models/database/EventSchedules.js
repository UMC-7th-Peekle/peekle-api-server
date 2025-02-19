import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EventSchedules extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    scheduleId: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'schedule_id'
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
    repeatType: {
      type: DataTypes.ENUM('none','daily','weekly','monthly','yearly','custom'),
      allowNull: false,
      field: 'repeat_type'
    },
    repeatEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'repeat_end_date'
    },
    isAllDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_all_day'
    },
    customText: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: 'custom_text'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date'
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'end_time'
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
    tableName: 'event_schedules',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "schedule_id" },
        ]
      },
      {
        name: "event_schedules_events_event_id_fk",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
    ]
  });
  }
}

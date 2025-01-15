import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EventSchedules extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    scheduleId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'schedule_id'
    },
    repeatType: {
      type: DataTypes.ENUM('daily','weekly','monthly','once'),
      allowNull: false,
      field: 'repeat_type'
    },
    repeatEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'repeat_end_date'
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
    ]
  });
  }
}

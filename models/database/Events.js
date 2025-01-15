import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class Events extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        eventId: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: "event_id",
        },
        scheduleId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "event_schedules",
            key: "schedule_id",
          },
          field: "schedule_id",
        },
        title: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        categoryId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "event_category",
            key: "category_id",
          },
          field: "category_id",
        },
        location: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        applicationStart: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "application_start",
        },
        applicationEnd: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "application_end",
        },
        createdAt: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "events",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "event_id" }],
          },
          {
            name: "events_event_schedules_schedule_id_fk",
            using: "BTREE",
            fields: [{ name: "schedule_id" }],
          },
          {
            name: "events_event_category_category_id_fk",
            using: "BTREE",
            fields: [{ name: "category_id" }],
          },
        ],
      }
    );
  }
}

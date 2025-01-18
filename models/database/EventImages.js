import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class EventImages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    imageId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'image_id'
    },
    eventId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'events',
        key: 'event_id'
      },
      field: 'event_id'
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
      field: 'image_url'
    },
    sequence: {
      type: DataTypes.INTEGER,
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
    tableName: 'event_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
      {
        name: "event_images_events_event_id_fk",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
    ]
  });
  }
}

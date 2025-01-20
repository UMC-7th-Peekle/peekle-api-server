import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PeeklingImages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    imageId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'image_id'
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
    peeklingId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'peekling',
        key: 'peekling_id'
      },
      field: 'peekling_id'
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
    tableName: 'peekling_images',
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
        name: "peekling_images_peekling_peekling_id_fk",
        using: "BTREE",
        fields: [
          { name: "peekling_id" },
        ]
      },
    ]
  });
  }
}

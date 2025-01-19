import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Notices extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    noticeId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'notice_id'
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'notice_category',
        key: 'category_id'
      },
      field: 'category_id'
    },
    adminId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'admin_id'
      },
      field: 'admin_id'
    },
    title: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isNotice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_notice'
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)",
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)",
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'notices',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notice_id" },
        ]
      },
      {
        name: "notices_admins_admin_id_fk",
        using: "BTREE",
        fields: [
          { name: "admin_id" },
        ]
      },
      {
        name: "notices_notice_categories_category_id_fk",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
  }
}

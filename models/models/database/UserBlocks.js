import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserBlocks extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    blockId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'block_id'
    },
    blockerUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "차단을 하는 사람",
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'blocker_user_id'
    },
    blockedUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "차단 당한 사람",
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'blocked_user_id'
    },
    reason: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active','deleted'),
      allowNull: false
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
    tableName: 'user_blocks',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "block_id" },
        ]
      },
      {
        name: "user_blocks_users_user_id_fk",
        using: "BTREE",
        fields: [
          { name: "blocker_user_id" },
        ]
      },
      {
        name: "user_blocks_users_user_id_fk_2",
        using: "BTREE",
        fields: [
          { name: "blocked_user_id" },
        ]
      },
    ]
  });
  }
}

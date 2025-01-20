import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class VerificationCode extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    sessionId: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'session_id'
    },
    identifierType: {
      type: DataTypes.ENUM('phone','email'),
      allowNull: false,
      field: 'identifier_type'
    },
    identifierValue: {
      type: DataTypes.STRING(512),
      allowNull: false,
      field: 'identifier_value'
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_verified'
    },
    code: {
      type: DataTypes.STRING(6),
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
    tableName: 'verification_code',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "session_id" },
        ]
      },
    ]
  });
  }
}

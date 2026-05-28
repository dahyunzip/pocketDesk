import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '../db'

export class Memo extends Model<InferAttributes<Memo>, InferCreationAttributes<Memo>> {
  declare id: CreationOptional<number>
  declare title: string
  declare content: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Memo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'Memo',
    tableName: 'memos',
    timestamps: true,
    underscored: true
  }
)

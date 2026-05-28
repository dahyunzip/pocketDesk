import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '../db'

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id: CreationOptional<number>
  declare title: string
  declare date: string
  declare color: string
  declare memo: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Event.init(
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
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#5b6cf6'
    },
    memo: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
    underscored: true
  }
)

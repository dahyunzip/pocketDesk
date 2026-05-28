import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '../db'

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'hold'

export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  declare id: CreationOptional<number>
  declare title: string
  declare status: TaskStatus
  declare priority: string
  declare order: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Task.init(
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
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'done', 'hold'),
      defaultValue: 'todo'
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'medium'
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    underscored: true
  }
)

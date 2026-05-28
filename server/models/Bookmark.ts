import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '../db'

export class Bookmark extends Model<InferAttributes<Bookmark>, InferCreationAttributes<Bookmark>> {
  declare id: CreationOptional<number>
  declare title: string
  declare url: string
  declare category: string
  declare order: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Bookmark.init(
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
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'default'
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
    modelName: 'Bookmark',
    tableName: 'bookmarks',
    timestamps: true,
    underscored: true
  }
)

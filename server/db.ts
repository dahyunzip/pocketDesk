import { Sequelize } from 'sequelize'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5433/pocketdesk'

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  pool: {
    max: 1,
    min: 0,
    idle: 5000,
    acquire: 30000
  },
  define: {
    timestamps: true,
    underscored: true
  }
})

export async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    console.log('Database connection established')
    await sequelize.sync({ alter: true })
    console.log('Database models synchronized')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

import { initializeDatabase } from '../db'
import '../models/Bookmark'
import '../models/Memo'
import '../models/Event'
import '../models/Task'

export default defineNitroPlugin(async () => {
  try {
    await initializeDatabase()
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
})

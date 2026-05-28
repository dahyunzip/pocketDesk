import { defineEventHandler, readBody } from 'h3'
import { Task } from '../../models'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const tasks = await Task.findAll({
      order: [['order', 'ASC']]
    })
    return { data: tasks, error: null, message: 'Tasks retrieved successfully' }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const task = await Task.create(body)
    return { data: task, error: null, message: 'Task created successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

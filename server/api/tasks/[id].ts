import { defineEventHandler, readBody } from 'h3'
import { Task } from '../../models'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const method = event.req.method

  if (method === 'GET') {
    const task = await Task.findByPk(id)
    if (!task) {
      return { data: null, error: 'Task not found', message: '' }
    }
    return { data: task, error: null, message: 'Task retrieved successfully' }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const task = await Task.findByPk(id)
    if (!task) {
      return { data: null, error: 'Task not found', message: '' }
    }
    await task.update(body)
    return { data: task, error: null, message: 'Task updated successfully' }
  }

  if (method === 'DELETE') {
    const task = await Task.findByPk(id)
    if (!task) {
      return { data: null, error: 'Task not found', message: '' }
    }
    await task.destroy()
    return { data: null, error: null, message: 'Task deleted successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

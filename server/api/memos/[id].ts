import { defineEventHandler, readBody } from 'h3'
import { Memo } from '../../models'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const method = event.req.method

  if (method === 'GET') {
    const memo = await Memo.findByPk(id)
    if (!memo) {
      return { data: null, error: 'Memo not found', message: '' }
    }
    return { data: memo, error: null, message: 'Memo retrieved successfully' }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const memo = await Memo.findByPk(id)
    if (!memo) {
      return { data: null, error: 'Memo not found', message: '' }
    }
    await memo.update(body)
    return { data: memo, error: null, message: 'Memo updated successfully' }
  }

  if (method === 'DELETE') {
    const memo = await Memo.findByPk(id)
    if (!memo) {
      return { data: null, error: 'Memo not found', message: '' }
    }
    await memo.destroy()
    return { data: null, error: null, message: 'Memo deleted successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

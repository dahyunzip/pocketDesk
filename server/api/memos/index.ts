import { defineEventHandler, readBody } from 'h3'
import { Memo } from '../../models'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const memos = await Memo.findAll({
      order: [['createdAt', 'DESC']]
    })
    return { data: memos, error: null, message: 'Memos retrieved successfully' }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const memo = await Memo.create(body)
    return { data: memo, error: null, message: 'Memo created successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

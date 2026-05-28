import { defineEventHandler, readBody } from 'h3'
import { Bookmark } from '../../models'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const bookmarks = await Bookmark.findAll({
      order: [['order', 'ASC']]
    })
    return { data: bookmarks, error: null, message: 'Bookmarks retrieved successfully' }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const bookmark = await Bookmark.create(body)
    return { data: bookmark, error: null, message: 'Bookmark created successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

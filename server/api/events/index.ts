import { defineEventHandler, readBody } from 'h3'
import { Event } from '../../models'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    })
    return { data: events, error: null, message: 'Events retrieved successfully' }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const eventRecord = await Event.create(body)
    return { data: eventRecord, error: null, message: 'Event created successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

import { defineEventHandler } from 'h3'
import { Event } from '../../models'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const method = event.req.method

  if (method === 'DELETE') {
    const eventRecord = await Event.findByPk(id)
    if (!eventRecord) {
      return { data: null, error: 'Event not found', message: '' }
    }
    await eventRecord.destroy()
    return { data: null, error: null, message: 'Event deleted successfully' }
  }

  return { data: null, error: 'Method not allowed', message: '' }
})

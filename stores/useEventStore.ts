import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse } from '~/types/api'

export interface Event {
  id: number
  title: string
  date: string
  color: string
  memo: string
  createdAt: string
}

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchEvents = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Event[]>>('/api/events')
      if (response.error) {
        error.value = response.error
        return
      }
      events.value = response.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch events'
    } finally {
      loading.value = false
    }
  }

  const addEvent = async (event: Omit<Event, 'id' | 'createdAt'>) => {
    try {
      const response = await $fetch<ApiResponse<Event>>('/api/events', {
        method: 'POST',
        body: event
      })
      if (response.error) {
        error.value = response.error
        return
      }
      events.value.push(response.data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add event'
    }
  }

  const deleteEvent = async (id: number) => {
    try {
      const response = await $fetch<ApiResponse<null>>(`/api/events/${id}`, {
        method: 'DELETE'
      })
      if (response.error) {
        error.value = response.error
        return
      }
      events.value = events.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete event'
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    deleteEvent
  }
})

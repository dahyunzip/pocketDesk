import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse } from '~/types/api'

export interface Bookmark {
  id: number
  title: string
  url: string
  category: string
  order: number
  createdAt: string
}

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref<Bookmark[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBookmarks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Bookmark[]>>('/api/bookmarks')
      if (response.error) {
        error.value = response.error
        return
      }
      bookmarks.value = response.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookmarks'
    } finally {
      loading.value = false
    }
  }

  const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    try {
      const response = await $fetch<ApiResponse<Bookmark>>('/api/bookmarks', {
        method: 'POST',
        body: bookmark
      })
      if (response.error) {
        error.value = response.error
        return
      }
      bookmarks.value.push(response.data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add bookmark'
    }
  }

  const deleteBookmark = async (id: number) => {
    try {
      const response = await $fetch<ApiResponse<null>>(`/api/bookmarks/${id}`, {
        method: 'DELETE'
      })
      if (response.error) {
        error.value = response.error
        return
      }
      bookmarks.value = bookmarks.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete bookmark'
    }
  }

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    addBookmark,
    deleteBookmark
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse } from '~/types/api'

export interface Memo {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export const useMemoStore = defineStore('memo', () => {
  const memos = ref<Memo[]>([])
  const currentMemo = ref<Memo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMemos = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Memo[]>>('/api/memos')
      if (response.error) {
        error.value = response.error
        return
      }
      memos.value = response.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch memos'
    } finally {
      loading.value = false
    }
  }

  const fetchMemoById = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Memo>>(`/api/memos/${id}`)
      if (response.error) {
        error.value = response.error
        return
      }
      currentMemo.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch memo'
    } finally {
      loading.value = false
    }
  }

  const createMemo = async (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await $fetch<ApiResponse<Memo>>('/api/memos', {
        method: 'POST',
        body: memo
      })
      if (response.error) {
        error.value = response.error
        return
      }
      memos.value.unshift(response.data)
      currentMemo.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create memo'
    }
  }

  const updateMemo = async (memo: Partial<Memo> & { id: number }) => {
    const { id, ...data } = memo
    try {
      const response = await $fetch<ApiResponse<Memo>>(`/api/memos/${id}`, {
        method: 'PUT',
        body: data
      })
      if (response.error) {
        error.value = response.error
        return
      }
      const index = memos.value.findIndex(m => m.id === id)
      if (index !== -1) {
        memos.value[index] = response.data
      }
      currentMemo.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update memo'
    }
  }

  const setCurrentMemo = (id: number) => {
    const memo = memos.value.find(m => m.id === id)
    if (memo) {
      currentMemo.value = memo
    }
  }

  const deleteMemo = async (id: number) => {
    try {
      const response = await $fetch<ApiResponse<null>>(`/api/memos/${id}`, {
        method: 'DELETE'
      })
      if (response.error) {
        error.value = response.error
        return
      }
      memos.value = memos.value.filter(m => m.id !== id)
      if (currentMemo.value?.id === id) {
        currentMemo.value = memos.value[0] || null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete memo'
    }
  }

  return {
    memos,
    currentMemo,
    loading,
    error,
    fetchMemos,
    fetchMemoById,
    createMemo,
    updateMemo,
    setCurrentMemo,
    deleteMemo
  }
})

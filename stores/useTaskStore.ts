import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiResponse } from '~/types/api'

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'hold'

export interface Task {
  id: number
  title: string
  status: TaskStatus
  priority: string
  order: number
  createdAt: string
  updatedAt: string
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const tasksByStatus = computed(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
      hold: []
    }
    tasks.value.forEach(task => {
      grouped[task.status].push(task)
    })
    return grouped
  })

  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse<Task[]>>('/api/tasks')
      if (response.error) {
        error.value = response.error
        return
      }
      tasks.value = response.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await $fetch<ApiResponse<Task>>('/api/tasks', {
        method: 'POST',
        body: task
      })
      if (response.error) {
        error.value = response.error
        return
      }
      tasks.value.push(response.data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task'
    }
  }

  const updateTask = async (id: number, task: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await $fetch<ApiResponse<Task>>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: task
      })
      if (response.error) {
        error.value = response.error
        return
      }
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task'
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const response = await $fetch<ApiResponse<null>>(`/api/tasks/${id}`, {
        method: 'DELETE'
      })
      if (response.error) {
        error.value = response.error
        return
      }
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task'
    }
  }

  const moveTask = async (id: number, status: TaskStatus, order: number) => {
    await updateTask(id, { status, order })
  }

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask
  }
})

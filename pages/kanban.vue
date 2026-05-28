<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '~/stores/useTaskStore'
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'
import TaskModal from '~/components/kanban/TaskModal.vue'

definePageMeta({
  layout: 'default'
})

const taskStore = useTaskStore()
const showModal = ref(false)
const selectedStatus = ref<'todo' | 'in_progress' | 'done' | 'hold'>('todo')

onMounted(async () => {
  await taskStore.fetchTasks()
})

const handleOpenModal = (status?: 'todo' | 'in_progress' | 'done' | 'hold') => {
  if (status) {
    selectedStatus.value = status
  }
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
}

const handleAddTask = async (taskData: { title: string; status: string; priority: string }) => {
  await taskStore.createTask({
    title: taskData.title,
    status: taskData.status as 'todo' | 'in_progress' | 'done' | 'hold',
    priority: taskData.priority,
    order: 0
  })
  handleCloseModal()
}

const handleDeleteTask = async (id: number) => {
  await taskStore.deleteTask(id)
}

const handleMoveTask = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'done' | 'hold') => {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task) {
    const statusTasks = taskStore.tasksByStatus[newStatus]
    const order = statusTasks.length
    await taskStore.moveTask(taskId, newStatus, order)
  }
}
</script>

<template>
  <div class="kanban-page">
    <div class="kanban-header">
      <div class="kanban-title">
        <span class="kanban-icon">📋</span>
        <h1>칸반 보드</h1>
      </div>
      <button class="kanban-btn" @click="handleOpenModal('todo')" aria-label="태스크 추가">
        <span>+ 태스크 추가</span>
      </button>
    </div>

    <KanbanBoard
      :tasks-by-status="taskStore.tasksByStatus"
      @delete-task="handleDeleteTask"
      @move-task="handleMoveTask"
      @open-modal="handleOpenModal"
    />

    <TaskModal
      v-if="showModal"
      :selected-status="selectedStatus"
      @close="handleCloseModal"
      @add-task="handleAddTask"
    />
  </div>
</template>

<style scoped>
.kanban-page { padding: 20px; }
.kanban-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.kanban-title { display: flex; align-items: center; gap: 8px; }
.kanban-icon { font-size: 2.56rem; }
.kanban-title h1 { font-size: 2.56rem; font-weight: 600; color: #2d2d2d; margin: 0; }
.kanban-btn { background: #5b58e8; color: #fff; border: none; border-radius: 10px; padding: 12.8px 25.6px; font-size: 2.08rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 9.6px; transition: background 0.15s; }
.kanban-btn:hover { background: #4a47d0; }
</style>

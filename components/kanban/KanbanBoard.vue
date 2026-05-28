<script setup lang="ts">
import { ref } from 'vue'
import type { Task, TaskStatus } from '~/stores/useTaskStore'

interface Props {
  tasksByStatus: Record<TaskStatus, Task[]>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  deleteTask: [id: number]
  moveTask: [taskId: number, newStatus: TaskStatus]
  openModal: [status: TaskStatus]
}>()

const COLUMNS: Array<{ id: TaskStatus; label: string; color: string }> = [
  { id: 'todo', label: '할 일', color: '#adb5bd' },
  { id: 'in_progress', label: '진행 중', color: '#4dabf7' },
  { id: 'done', label: '완료', color: '#51cf66' },
  { id: 'hold', label: '보류', color: '#ffa94d' }
]

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  feature: { bg: '#eeedfe', text: '#534ab7' },
  setup: { bg: '#f1efe8', text: '#5f5e5a' },
  bug: { bg: '#faece7', text: '#993c1d' },
  blocked: { bg: '#faece7', text: '#993c1d' }
}

const draggedTaskId = ref<number | null>(null)

const handleDragStart = (e: DragEvent, taskId: number) => {
  draggedTaskId.value = taskId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragEnd = () => {
  draggedTaskId.value = null
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const handleDropOnColumn = (e: DragEvent, targetStatus: TaskStatus) => {
  e.preventDefault()
  if (draggedTaskId.value !== null) {
    emit('moveTask', draggedTaskId.value, targetStatus)
    draggedTaskId.value = null
  }
}
</script>

<template>
  <div class="kanban-cols">
    <div
      v-for="col in COLUMNS"
      :key="col.id"
      class="kanban-col"
      @dragover="handleDragOver"
      @drop="handleDropOnColumn($event, col.id)"
    >
      <div class="col-header">
        <span class="col-title">
          <span class="col-dot" :style="{ background: col.color }" />
          {{ col.label }}
        </span>
        <div class="col-actions">
          <span class="col-count">{{ props.tasksByStatus[col.id]?.length || 0 }}</span>
          <button
            class="col-add-btn"
            @click="emit('openModal', col.id)"
            aria-label="태스크 추가"
          >
            +
          </button>
        </div>
      </div>

      <div class="task-list">
        <div
          v-for="task in props.tasksByStatus[col.id]"
          :key="task.id"
          class="kanban-task"
          draggable="true"
          @dragstart="handleDragStart($event, task.id)"
          @dragend="handleDragEnd"
        >
          <div class="task-row">
            <span class="task-title">{{ task.title }}</span>
            <button
              class="task-del-btn"
              @click="emit('deleteTask', task.id)"
              aria-label="삭제"
            >
              ✕
            </button>
          </div>
          <span
            v-if="task.priority"
            class="task-tag"
            :style="TAG_COLORS[task.priority] ? {
              background: TAG_COLORS[task.priority].bg,
              color: TAG_COLORS[task.priority].text
            } : {}"
          >
            {{ task.priority }}
          </span>
        </div>

        <div v-if="!props.tasksByStatus[col.id] || props.tasksByStatus[col.id].length === 0" class="col-empty">
          태스크 없음
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.92rem; align-items: start; }
.kanban-col { background: #fff; border-radius: 14px; border: 1.5px solid #e8e6df; padding: 1.92rem; min-height: 480px; }
.col-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.92rem; padding-bottom: 1.6rem; border-bottom: 1.5px solid #f0eee8; }
.col-title { font-size: 2.08rem; font-weight: 500; display: flex; align-items: center; gap: 9.6px; color: #2d2d2d; }
.col-dot { width: 12.8px; height: 12.8px; border-radius: 50%; display: inline-block; }
.col-actions { display: flex; align-items: center; gap: 9.6px; }
.col-count { font-size: 1.76rem; background: #f5f4ef; border-radius: 20px; padding: 3.2px 12.8px; color: #888780; }
.col-add-btn { background: none; border: none; cursor: pointer; color: #b4b2a9; font-size: 2.08rem; line-height: 1; padding: 3.2px; transition: color 0.15s; }
.col-add-btn:hover { color: #5b58e8; }
.task-list { min-height: 60px; display: flex; flex-direction: column; gap: 12.8px; }
.kanban-task { background: #f8f7f3; border-radius: 10px; padding: 1.6rem 1.92rem; border: 1.5px solid #e8e6df; cursor: grab; transition: box-shadow 0.15s, opacity 0.15s; user-select: none; }
.kanban-task:active { cursor: grabbing; opacity: 0.7; }
.task-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12.8px; }
.task-title { font-size: 2.08rem; color: #2d2d2d; line-height: 1.4; flex: 1; word-break: break-word; }
.task-del-btn { background: none; border: none; cursor: pointer; color: #d3d1c7; font-size: 2.24rem; padding: 0; line-height: 1; flex-shrink: 0; transition: color 0.15s; }
.task-del-btn:hover { color: #e24b4a; }
.task-tag { display: inline-block; margin-top: 9.6px; font-size: 1.76rem; border-radius: 20px; padding: 3.2px 12.8px; }
.col-empty { text-align: center; padding: 32px 0; color: #d3d1c7; font-size: 1.92rem; }
</style>

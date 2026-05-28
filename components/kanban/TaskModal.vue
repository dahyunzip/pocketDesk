<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TaskStatus } from '~/stores/useTaskStore'

interface Props {
  selectedStatus: TaskStatus
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  addTask: [data: { title: string; status: string; priority: string }]
}>()

const STATUSES = [
  { id: 'todo', label: '할 일' },
  { id: 'in_progress', label: '진행 중' },
  { id: 'done', label: '완료' },
  { id: 'hold', label: '보류' }
]

const PRIORITIES = [
  { id: 'feature', label: 'Feature' },
  { id: 'setup', label: 'Setup' },
  { id: 'bug', label: 'Bug' },
  { id: 'blocked', label: 'Blocked' }
]

const title = ref('')
const status = ref(props.selectedStatus)
const priority = ref('feature')

const handleAdd = () => {
  if (!title.value.trim()) return
  emit('addTask', {
    title: title.value.trim(),
    status: status.value,
    priority: priority.value
  })
  title.value = ''
  status.value = props.selectedStatus
  priority.value = 'feature'
}

const titleInput = ref<HTMLInputElement>()

onMounted(() => {
  titleInput.value?.focus()
})
</script>

<template>
  <div class="modal-bg" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-title">새 태스크</div>
      <input
        ref="titleInput"
        v-model="title"
        placeholder="태스크 이름"
        maxlength="40"
        @keydown.enter="handleAdd"
      />
      <select v-model="status">
        <option v-for="s in STATUSES" :key="s.id" :value="s.id">
          {{ s.label }}
        </option>
      </select>
      <select v-model="priority">
        <option v-for="p in PRIORITIES" :key="p.id" :value="p.id">
          {{ p.label }}
        </option>
      </select>
      <div class="modal-btns">
        <button class="btn-cancel" @click="emit('close')">취소</button>
        <button class="btn-ok" @click="handleAdd">추가</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-bg { position: fixed; inset: 0; background: rgba(45, 45, 45, 0.3); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 16px; padding: 3.2rem; width: 48rem; border: 1.5px solid #e8e6df; }
.modal-title { font-size: 2.4rem; font-weight: 500; color: #2d2d2d; margin-bottom: 2.24rem; }
.modal input, .modal select { width: 100%; border: 1.5px solid #e8e6df; border-radius: 10px; padding: 1.44rem 1.92rem; font-size: 2.08rem; color: #2d2d2d; background: #f8f7f3; outline: none; margin-bottom: 1.6rem; }
.modal input:focus, .modal select:focus { border-color: #5b58e8; background: #fff; }
.modal-btns { display: flex; gap: 12.8px; justify-content: flex-end; margin-top: 6.4px; }
.btn-cancel { background: none; border: 1.5px solid #e8e6df; border-radius: 8px; padding: 1.12rem 2.24rem; font-size: 2.08rem; cursor: pointer; color: #888780; transition: all 0.15s; }
.btn-cancel:hover { border-color: #5b58e8; color: #5b58e8; }
.btn-ok { background: #5b58e8; border: none; border-radius: 8px; padding: 1.12rem 2.24rem; font-size: 2.08rem; cursor: pointer; color: #fff; font-weight: 500; transition: background 0.15s; }
.btn-ok:hover { background: #4a47d0; }
</style>

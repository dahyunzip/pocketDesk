<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  selectedDate: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  addEvent: [data: { title: string; color: string; memo: string }]
}>()

const COLORS = ['#5b58e8', '#ff6b6b', '#51cf66', '#ffa94d', '#4dabf7', '#e64980', '#20c997']
const title = ref('')
const selectedColor = ref(COLORS[0])
const memo = ref('')

const dateLabel = computed(() => {
  if (!props.selectedDate) return '일정 추가'
  return `${props.selectedDate} 일정 추가`
})

const handleAdd = () => {
  if (!title.value.trim()) return
  emit('addEvent', {
    title: title.value.trim(),
    color: selectedColor.value,
    memo: memo.value
  })
  title.value = ''
  selectedColor.value = COLORS[0]
  memo.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

const titleInput = ref<HTMLInputElement>()

onMounted(() => {
  titleInput.value?.focus()
})
</script>

<template>
  <div class="modal-bg" @keydown="handleKeydown" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-title">{{ dateLabel }}</div>
      <input
        ref="titleInput"
        v-model="title"
        placeholder="일정 이름"
        @keydown.enter="handleAdd"
      />
      <div class="color-row">
        <div
          v-for="color in COLORS"
          :key="color"
          :class="['color-opt', { active: color === selectedColor }]"
          :style="{ background: color }"
          @click="selectedColor = color"
        />
      </div>
      <div class="modal-btns">
        <button class="btn-cancel" @click="emit('close')">취소</button>
        <button class="btn-ok" @click="handleAdd">추가</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-bg { position: fixed; inset: 0; background: rgba(45, 45, 45, 0.3); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 16px; padding: 20px; width: 280px; border: 1.5px solid #e8e6df; }
.modal-title { font-size: 1.5rem; font-weight: 500; color: #2d2d2d; margin-bottom: 14px; }
.modal input { width: 100%; border: 1.5px solid #e8e6df; border-radius: 10px; padding: 9px 12px; font-size: 1.3rem; color: #2d2d2d; background: #f8f7f3; outline: none; margin-bottom: 10px; }
.modal input:focus { border-color: #5b58e8; background: #fff; }
.color-row { display: flex; gap: 8px; margin-bottom: 14px; }
.color-opt { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; }
.color-opt.active { border-color: #2d2d2d; }
.modal-btns { display: flex; gap: 8px; justify-content: flex-end; }
.btn-cancel { background: none; border: 1.5px solid #e8e6df; border-radius: 8px; padding: 7px 14px; font-size: 1.3rem; cursor: pointer; color: #888780; transition: all 0.15s; }
.btn-cancel:hover { border-color: #5b58e8; color: #5b58e8; }
.btn-ok { background: #5b58e8; border: none; border-radius: 8px; padding: 7px 14px; font-size: 1.3rem; cursor: pointer; color: #fff; font-weight: 500; transition: background 0.15s; }
.btn-ok:hover { background: #4a47d0; }
</style>

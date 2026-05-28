<script setup lang="ts">
import type { Memo } from '~/server/models'

interface Props {
  memos: Memo[]
  currentId?: number
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  select: [id: number]
  delete: [id: number]
}>()

const handleDelete = (e: Event, id: number) => {
  e.stopPropagation()
  emit('delete', id)
}

const formatDate = (createdAt: any) => {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

const getPreview = (content: string) => {
  if (!content) return ''
  return content.replace(/[#`*\n]/g, ' ').slice(0, 30)
}
</script>

<template>
  <div class="memo-list">
    <div
      v-for="memo in memos"
      :key="memo.id"
      :class="['memo-item', { active: memo.id === currentId }]"
      @click="emit('select', memo.id)"
    >
      <button
        class="memo-item-del"
        @click="handleDelete($event, memo.id)"
        aria-label="삭제"
      >
        ✕
      </button>
      <div class="memo-item-title">{{ memo.title || '제목 없음' }}</div>
      <div class="memo-item-date">{{ formatDate(memo.createdAt) }}</div>
      <div class="memo-item-preview">{{ getPreview(memo.content) }}</div>
    </div>
  </div>
</template>

<style scoped>
.memo-list { display: flex; flex-direction: column; gap: 6px; }
.memo-item { background: #fff; border-radius: 12px; border: 1.5px solid #e8e6df; padding: 11px 12px; cursor: pointer; transition: border-color 0.15s; display: flex; flex-direction: column; gap: 3px; position: relative; }
.memo-item:hover { border-color: #cecbf6; }
.memo-item.active { border-color: #5b58e8; background: #fafafe; }
.memo-item-title { font-size: 1.6rem; color: #2d2d2d; font-weight: 500; padding-right: 20px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.memo-item-date { font-size: 1.2rem; color: #b4b2a9; }
.memo-item-preview { font-size: 1.6rem; color: #b4b2a9; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.memo-item-del { position: absolute; top: 8px; right: 8px; background: none; border: none; cursor: pointer; color: #d3d1c7; font-size: 1.6rem; display: none; }
.memo-item:hover .memo-item-del { display: block; }
.memo-item-del:hover { color: #e24b4a; }
</style>

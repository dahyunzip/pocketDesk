<script setup lang="ts">
import { nextTick } from 'vue'
import { useMemoStore } from '~/stores/useMemoStore'
import MemoList from '~/components/memo/MemoList.vue'
import MemoEditor from '~/components/memo/MemoEditor.vue'

const memoStore = useMemoStore()

onMounted(async () => {
  await memoStore.fetchMemos()
  if (memoStore.memos.length > 0) {
    memoStore.setCurrentMemo(memoStore.memos[0].id)
  }
})

const handleNewMemo = async () => {
  const newMemo = await memoStore.createMemo({ title: '', content: '' })
  if (newMemo) {
    nextTick(() => {
      const input = document.querySelector('.memo-title-input') as HTMLInputElement
      input?.focus()
    })
  }
}

const handleSelectMemo = (id: number) => {
  memoStore.setCurrentMemo(id)
}

const handleDeleteMemo = async (id: number) => {
  await memoStore.deleteMemo(id)
}
</script>

<template>
  <div class="memo-page">
    <div class="memo-header">
      <div class="memo-title-section">
        <span class="memo-icon">📝</span>
        <h1>메모</h1>
      </div>
      <button class="btn-new-memo" @click="handleNewMemo" aria-label="새 메모 생성">
        <span>+</span> 새 메모
      </button>
    </div>

    <div class="memo-layout">
      <MemoList
        :memos="memoStore.memos"
        :current-id="memoStore.currentMemo?.id"
        :loading="memoStore.loading"
        @select="handleSelectMemo"
        @delete="handleDeleteMemo"
      />
      <MemoEditor
        v-if="memoStore.currentMemo"
        :key="memoStore.currentMemo.id"
        :memo="memoStore.currentMemo"
        :loading="memoStore.loading"
        @update="memoStore.updateMemo"
      />
      <div v-else class="memo-empty">
        <p>메모를 선택하거나 새로 만들어보세요</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memo-page { background: #f5f4ef; padding: 20px; min-height: 100vh; }
.memo-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.memo-title-section { display: flex; align-items: center; gap: 8px; }
.memo-icon { font-size: 1.8rem; }
.memo-title-section h1 { font-size: 2rem; font-weight: 600; color: #2d2d2d; margin: 0; }
.btn-new-memo { background: #5b6cf6; color: #fff; border: none; border-radius: 10px; padding: 8px 16px; font-size: 1.4rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s; }
.btn-new-memo:hover { background: #4a47d0; }
.memo-layout { display: grid; grid-template-columns: 220px 1fr; gap: 14px; min-height: 440px; }
.memo-empty { display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 14px; border: 1.5px solid #e8e6df; color: #b4b2a9; font-size: 0.8rem; }
</style>

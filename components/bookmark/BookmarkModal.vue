<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBookmarkStore } from '~/stores/useBookmarkStore'

const emit = defineEmits<{
  close: []
  added: []
}>()

const bookmarkStore = useBookmarkStore()

const title = ref('')
const url = ref('')
const category = ref('Docs')
const isSubmitting = ref(false)

const categories = ['Docs', 'Dev', 'Design', 'DB', 'AI', 'Deploy', '기타']

const handleSubmit = async () => {
  if (!title.value.trim() || !url.value.trim()) {
    return
  }

  isSubmitting.value = true
  try {
    await bookmarkStore.addBookmark({
      title: title.value.trim(),
      url: url.value.trim(),
      category: category.value,
      order: bookmarkStore.bookmarks.length
    })
    emit('added')
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">북마크 추가</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <input
            v-model="title"
            type="text"
            placeholder="이름 (예: Vue 공식문서)"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="url"
            type="url"
            placeholder="URL (https://...)"
            required
          />
        </div>

        <div class="form-group">
          <select v-model="category">
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn-cancel"
            @click="handleClose"
            :disabled="isSubmitting"
          >
            취소
          </button>
          <button
            type="submit"
            class="btn-ok"
            :disabled="isSubmitting || !title.trim() || !url.trim()"
          >
            {{ isSubmitting ? '추가 중...' : '추가' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 45, 45, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 300px;
  border: 1.5px solid #e8e6df;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.modal-header {
  margin-bottom: 14px;
}

.modal-title {
  font-size: 15px;
  font-weight: 500;
  color: #2d2d2d;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  width: 100%;
}

.modal input,
.modal select {
  width: 100%;
  border: 1.5px solid #e8e6df;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  color: #2d2d2d;
  background: #f8f7f3;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s;
}

.modal input:focus,
.modal select:focus {
  border-color: #5b58e8;
  background: #fff;
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-cancel {
  background: none;
  border: 1.5px solid #e8e6df;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #888780;
  font-weight: 500;
  transition: all 0.15s;
}

.btn-cancel:hover:not(:disabled) {
  border-color: #5b58e8;
  color: #5b58e8;
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ok {
  background: #5b58e8;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #fff;
  font-weight: 500;
  transition: background 0.15s;
}

.btn-ok:hover:not(:disabled) {
  background: #4a47d0;
}

.btn-ok:disabled {
  background: #b4b2a9;
  cursor: not-allowed;
}
</style>

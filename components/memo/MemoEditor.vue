<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import type { Memo } from '~/server/models'

interface Props {
  memo: Memo
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [memo: Partial<Memo>]
}>()

const tab = ref<'edit' | 'preview'>('edit')
const title = ref(props.memo.title)
const content = ref(props.memo.content)
const saveHint = ref('자동 저장됩니다')
let saveTimer: NodeJS.Timeout | null = null

// Marked 설정
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: (code: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

const renderedContent = computed(() => {
  if (!content.value) return ''
  const html = marked(content.value) as string
  return DOMPurify.sanitize(html)
})

watch(
  () => props.memo.id,
  () => {
    title.value = props.memo.title
    content.value = props.memo.content
  }
)

const autoSave = () => {
  if (saveTimer) clearTimeout(saveTimer)
  saveHint.value = '저장 중...'

  saveTimer = setTimeout(() => {
    emit('update', {
      id: props.memo.id,
      title: title.value,
      content: content.value
    })
    saveHint.value = '저장됨'
    setTimeout(() => {
      saveHint.value = '자동 저장됩니다'
    }, 1500)
  }, 1000)
}

const handleTitleChange = () => {
  autoSave()
}

const handleContentChange = () => {
  autoSave()
}

const handleSaveClick = () => {
  if (saveTimer) clearTimeout(saveTimer)
  emit('update', {
    id: props.memo.id,
    title: title.value,
    content: content.value
  })
  saveHint.value = '저장됨'
  setTimeout(() => {
    saveHint.value = '자동 저장됩니다'
  }, 1500)
}
</script>

<template>
  <div class="memo-editor">
    <div class="memo-editor-top">
      <input
        v-model="title"
        class="memo-title-input"
        placeholder="제목 없음"
        @input="handleTitleChange"
      />
      <button
        :class="['memo-tab', { active: tab === 'edit' }]"
        @click="tab = 'edit'"
      >
        편집
      </button>
      <button
        :class="['memo-tab', { active: tab === 'preview' }]"
        @click="tab = 'preview'"
      >
        미리보기
      </button>
    </div>

    <div class="memo-body">
      <textarea
        v-show="tab === 'edit'"
        v-model="content"
        class="memo-textarea"
        placeholder="마크다운으로 작성하세요..."
        @input="handleContentChange"
      />
      <div
        v-show="tab === 'preview'"
        class="memo-preview"
        v-html="renderedContent"
      />
    </div>

    <div class="memo-save-row">
      <span class="memo-save-hint">{{ saveHint }}</span>
      <button class="btn-save" @click="handleSaveClick">저장</button>
    </div>
  </div>
</template>

<style scoped>
.memo-editor { background: #fff; border-radius: 14px; border: 1.5px solid #e8e6df; display: flex; flex-direction: column; overflow: hidden; }
.memo-editor-top { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1.5px solid #f0eee8; }
.memo-title-input { flex: 1; border: none; outline: none; font-size: 1.4rem; font-weight: 500; color: #2d2d2d; background: transparent; }
.memo-tab { background: none; border: none; cursor: pointer; font-size: 1.4rem; color: #b4b2a9; padding: 4px 10px; border-radius: 6px; transition: all 0.15s; }
.memo-tab.active { background: #eeedfe; color: #534ab7; font-weight: 500; }
.memo-body { flex: 1; padding: 14px; display: flex; gap: 0; overflow: hidden; }
.memo-textarea { width: 100%; min-height: 300px; border: none; outline: none; font-size: 1.6rem; color: #2d2d2d; background: transparent; resize: none; line-height: 1.7; font-family: var(--font-mono); }
.memo-preview { width: 100%; min-height: 300px; font-size: 1.6rem; color: #2d2d2d; line-height: 1.7; overflow-y: auto; }
.memo-save-row { padding: 10px 14px; border-top: 1.5px solid #f0eee8; display: flex; justify-content: space-between; align-items: center;}
.memo-save-hint { font-size: 1.4rem; color: #b4b2a9; }
.btn-save { background: #5b6cf6; border: none; border-radius: 8px; padding: 6px 14px; font-size: 1.4rem; cursor: pointer; color: #fff; font-weight: 500; transition: background 0.15s; }
.btn-save:hover { background: #4a47d0; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* Markdown rendering styles */
:deep(h1) { font-size: 3.2rem; font-weight: 500; margin: 8px 0 4px; }
:deep(h2) { font-size: 2.4rem; font-weight: 500; margin: 8px 0 4px; }
:deep(h3) { font-size: 2rem; font-weight: 500; margin: 8px 0 4px; }
:deep(p) { margin-bottom: 8px; }
:deep(code) { background: #f1efe8; border-radius: 4px; padding: 1px 5px; font-size: 1.4rem; font-family: var(--font-mono); }
:deep(pre) { background: #f1efe8; border-radius: 8px; padding: 10px; margin-bottom: 8px; overflow-x: auto; }
:deep(pre code) { background: none; padding: 0; }
:deep(ul), :deep(ol) { padding-left: 18px; margin-bottom: 8px; }
:deep(li) { margin-bottom: 3px; }
:deep(blockquote) { border-left: 3px solid #e8e6df; padding-left: 12px; color: #8a8880; margin: 8px 0; }
</style>

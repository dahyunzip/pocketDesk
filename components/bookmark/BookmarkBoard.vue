<script setup lang="ts">
import type { Bookmark } from '~/stores/useBookmarkStore'

defineProps<{
  bookmarks: Bookmark[]
  loading: boolean
}>()

const emit = defineEmits<{
  delete: [id: number]
  add: []
}>()

const CAT_BG: Record<string, string> = {
  Docs: '#eeedfe',
  Dev: '#f5f4ef',
  Design: '#faece7',
  DB: '#e6f1fb',
  AI: '#eeedfe',
  Deploy: '#faeeda',
  '기타': '#f1efe8'
}

const CAT_ICON_COLOR: Record<string, string> = {
  Docs: '#534ab7',
  Dev: '#2c2c2a',
  Design: '#993c1d',
  DB: '#185fa5',
  AI: '#534ab7',
  Deploy: '#633806',
  '기타': '#5f5e5a'
}

const CAT_ICON: Record<string, string> = {
  Docs: 'ti-file-text',
  Dev: 'ti-brand-github',
  Design: 'ti-brand-figma',
  DB: 'ti-database',
  AI: 'ti-sparkles',
  Deploy: 'ti-brand-vercel',
  '기타': 'ti-link'
}

const getIconBg = (category: string) => CAT_BG[category] || '#f1efe8'
const getIconColor = (category: string) => CAT_ICON_COLOR[category] || '#888780'
const getIconClass = (category: string) => CAT_ICON[category] || 'ti-link'

const goUrl = (url: string) => {
  window.open(url, '_blank')
}

const handleDelete = (e: Event, id: number) => {
  e.stopPropagation()
  emit('delete', id)
}
</script>

<template>
  <div class="bookmark-board">
    <div v-if="loading" class="loading">
      로딩 중...
    </div>
    <div v-else-if="bookmarks.length === 0" class="empty">
      북마크가 없습니다
    </div>
    <div v-else class="bm-grid">
      <div
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        class="bm-item"
        @click="goUrl(bookmark.url)"
      >
        <button
          class="bm-del"
          :aria-label="`${bookmark.title} 삭제`"
          @click="handleDelete($event, bookmark.id)"
        >
          <i class="ti ti-x"></i>
        </button>
        <div class="bm-icon" :style="{ background: getIconBg(bookmark.category) }">
          <i
            :class="['ti', getIconClass(bookmark.category)]"
            :style="{ color: getIconColor(bookmark.category) }"
            aria-hidden="true"
          ></i>
        </div>
        <div class="bm-name">{{ bookmark.title }}</div>
        <div class="bm-cat">{{ bookmark.category }}</div>
      </div>

      <div class="bm-item bm-add" @click="emit('add')">
        <div class="bm-icon" style="background: #f1efe8">
          <i class="ti ti-plus" style="color: #b4b2a9"></i>
        </div>
        <div class="bm-name add-text">추가</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmark-board {
  width: 100%;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: #888780;
  font-size: 14px;
}

.bm-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.bm-item {
  background: #fff;
  border-radius: 14px;
  border: 1.5px solid #e8e6df;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
  transition: border-color 0.15s;
}

.bm-item:hover {
  border-color: #cecbf6;
}

.bm-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.bm-name {
  font-size: 13px;
  color: #2d2d2d;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
}

.bm-cat {
  font-size: 11px;
  color: #b4b2a9;
}

.bm-del {
  position: absolute;
  top: 7px;
  right: 7px;
  background: none;
  border: none;
  cursor: pointer;
  color: #d3d1c7;
  font-size: 14px;
  padding: 2px;
  line-height: 1;
  display: none;
  transition: color 0.15s;
}

.bm-item:hover .bm-del {
  display: block;
}

.bm-del:hover {
  color: #e24b4a;
}

.bm-add {
  border: 1.5px dashed #d3d1c7;
  background: #f8f7f3;
}

.bm-add:hover {
  border-color: #cecbf6;
  background: #eeedfe;
}

.add-text {
  color: #b4b2a9;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .bm-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .bm-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

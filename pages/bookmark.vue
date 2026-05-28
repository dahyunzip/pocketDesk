<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBookmarkStore } from '~/stores/useBookmarkStore'
import BookmarkBoard from '~/components/bookmark/BookmarkBoard.vue'

const bookmarkStore = useBookmarkStore()
const selectedCategory = ref('전체')
const showModal = ref(false)

const allCategories = computed(() => {
  const categories = new Set(bookmarkStore.bookmarks.map(b => b.category))
  return ['전체', ...Array.from(categories)]
})

const filteredBookmarks = computed(() => {
  if (selectedCategory.value === '전체') {
    return bookmarkStore.bookmarks
  }
  return bookmarkStore.bookmarks.filter(b => b.category === selectedCategory.value)
})

const handleAddClick = () => {
  showModal.value = true
}

const handleDeleteBookmark = async (id: number) => {
  await bookmarkStore.deleteBookmark(id)
}

const handleModalClose = () => {
  showModal.value = false
}

const handleBookmarkAdded = () => {
  showModal.value = false
}

onMounted(() => {
  bookmarkStore.fetchBookmarks()
})
</script>

<template>
  <section class="bookmark-page p-lg">
    <div class="bookmark-header f-between items-center mb-md">
      <h1 class="bookmark-title f-center gap-2">
        <i class="ti ti-bookmark text-primary" aria-hidden="true"></i>
        북마크
      </h1>
      <button class="btn-primary f-center gap-1" @click="handleAddClick">
        <i class="ti ti-plus"></i>
        북마크 추가
      </button>
    </div>

    <div class="bookmark-tabs f-wrap gap-1 mb-md">
      <button
        v-for="cat in allCategories"
        :key="cat"
        :class="['tab', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <BookmarkBoard
      :bookmarks="filteredBookmarks"
      :loading="bookmarkStore.loading"
      @delete="handleDeleteBookmark"
      @add="handleAddClick"
    />

    <BookmarkModal
      v-if="showModal"
      @close="handleModalClose"
      @added="handleBookmarkAdded"
    />
  </section>
</template>

<style scoped>
.bookmark-page {
  background: #f7f6f2;
  min-height: 100vh;
}

.bookmark-header {
  margin-bottom: 16px;
}

.bookmark-title {
  font-size: 16px;
  font-weight: 500;
  color: #2d2d2d;
}

.bookmark-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tab {
  background: #fff;
  border: 1.5px solid #e8e6df;
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 12px;
  color: #888780;
  cursor: pointer;
  transition: all 0.15s;
}

.tab:hover {
  border-color: #cecbf6;
}

.tab.active {
  background: #eeedfe;
  border-color: #cecbf6;
  color: #534ab7;
  font-weight: 500;
}

.btn-primary {
  background: #5b58e8;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: #4a47d0;
}

.text-primary {
  color: #5b58e8;
  font-size: 18px;
}

.f-center {
  display: flex;
  align-items: center;
}

.f-between {
  display: flex;
  justify-content: space-between;
}

.f-wrap {
  display: flex;
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

.gap-1 {
  gap: 6px;
}

.gap-2 {
  gap: 16px;
}

.mb-md {
  margin-bottom: 16px;
}

.p-lg {
  padding: 20px;
}
</style>

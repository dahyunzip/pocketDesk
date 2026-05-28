<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '~/stores/useEventStore'

interface Props {
  selectedDate: string
  dayEvents: Event[]
  monthEvents: Event[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  openModal: []
  deleteEvent: [id: number]
}>()

const dateLabel = computed(() => {
  if (!props.selectedDate) return '날짜를 선택하세요'
  const [y, m, d] = props.selectedDate.split('-')
  return `${m}/${d} 일정`
})
</script>

<template>
  <div class="cal-side">
    <div class="cal-side-card">
      <div class="cal-side-title">
        <span>{{ dateLabel }}</span>
        <button class="cal-nav-btn" @click="emit('openModal')" aria-label="일정 추가" style="width: 26px; height: 26px">
          +
        </button>
      </div>
      <div class="evt-list">
        <div
          v-if="dayEvents.length === 0"
          class="evt-none"
        >
          일정 없음
        </div>
        <div
          v-for="evt in dayEvents"
          :key="evt.id"
          class="evt-item"
        >
          <div class="evt-dot-lg" :style="{ background: evt.color }" />
          <div class="evt-info">
            <div class="evt-title">{{ evt.title }}</div>
          </div>
          <button
            class="evt-del"
            @click="emit('deleteEvent', evt.id)"
            aria-label="삭제"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="cal-side-card">
      <div class="cal-side-title">이번 달 일정</div>
      <div class="evt-list">
        <div
          v-if="monthEvents.length === 0"
          class="evt-none"
        >
          일정 없음
        </div>
        <div
          v-for="evt in monthEvents"
          :key="evt.id"
          class="evt-item"
        >
          <div class="evt-dot-lg" :style="{ background: evt.color }" />
          <div class="evt-info">
            <div class="evt-title">{{ evt.title }}</div>
            <div class="evt-date">{{ evt.date.slice(5).replace('-', '/') }}</div>
          </div>
          <button
            class="evt-del"
            @click="emit('deleteEvent', evt.id)"
            aria-label="삭제"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cal-side { display: flex; flex-direction: column; gap: 10px; }
.cal-side-card { background: #fff; border-radius: 14px; border: 1.5px solid #e8e6df; padding: 14px; }
.cal-side-title { font-size: 1.3rem; font-weight: 500; color: #2d2d2d; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
.cal-nav-btn { background: none; border: 1.5px solid #e8e6df; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #888780; font-size: 1.4rem; transition: all 0.15s; }
.cal-nav-btn:hover { border-color: #cecbf6; color: #5b58e8; }
.evt-list { display: flex; flex-direction: column; gap: 6px; }
.evt-item { display: flex; align-items: center; justify-content: space-between; padding: 7px 8px; border-radius: 8px; background: #f8f7f3; gap: 8px; }
.evt-dot-lg { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.evt-info { flex: 1; min-width: 0; }
.evt-title { font-size: 1.2rem; color: #2d2d2d; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.evt-date { font-size: 1.1rem; color: #b4b2a9; }
.evt-del { background: none; border: none; cursor: pointer; color: #d3d1c7; font-size: 1.3rem; flex-shrink: 0; transition: color 0.15s; }
.evt-del:hover { color: #e24b4a; }
.evt-none { font-size: 1.2rem; color: #b4b2a9; text-align: center; padding: 10px 0; }
</style>

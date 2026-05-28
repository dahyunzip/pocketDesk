<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useBookmarkStore } from '~/stores/useBookmarkStore'
import { useMemoStore } from '~/stores/useMemoStore'
import { useTaskStore } from '~/stores/useTaskStore'
import { useEventStore } from '~/stores/useEventStore'

definePageMeta({
  layout: 'default'
})

const bookmarkStore = useBookmarkStore()
const memoStore = useMemoStore()
const taskStore = useTaskStore()
const eventStore = useEventStore()

onMounted(async () => {
  await Promise.all([
    bookmarkStore.fetchBookmarks(),
    memoStore.fetchMemos(),
    taskStore.fetchTasks(),
    eventStore.fetchEvents()
  ])
})

const recentMemos = computed(() => memoStore.memos.slice(0, 4))

const upcomingEvents = computed(() => {
  const today = new Date()
  return eventStore.events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
})

const tasksByStatus = computed(() => taskStore.tasksByStatus)

const weatherData = {
  temp: '23',
  condition: '맑음',
  feelsLike: '21',
  humidity: '58',
  wind: '3',
  pm: '좋음'
}

const busData = [
  { no: '51번', direction: '센텀시티 방향', time: '3분 후' },
  { no: '139번', direction: '해운대 방향', time: '11분 후' },
  { no: '51번', direction: '센텀시티 방향', time: '18분 후' }
]

const BOOKMARK_COLORS: Record<string, { bg: string; icon: string }> = {
  Docs: { bg: '#eeedfe', icon: '#534ab7' },
  Dev: { bg: '#f5f4ef', icon: '#2c2c2a' },
  Design: { bg: '#faece7', icon: '#993c1d' },
  DB: { bg: '#e6f1fb', icon: '#185fa5' },
  AI: { bg: '#eeedfe', icon: '#534ab7' },
  Deploy: { bg: '#faeeda', icon: '#633806' },
  '기타': { bg: '#f1efe8', icon: '#5f5e5a' }
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  feature: { bg: '#eeedfe', text: '#534ab7' },
  setup: { bg: '#f1efe8', text: '#5f5e5a' },
  bug: { bg: '#faece7', text: '#993c1d' },
  blocked: { bg: '#faece7', text: '#993c1d' },
  done: { bg: '#e1f5ee', text: '#0f6e56' }
}

const TASK_STATUS_COLORS: Record<string, string> = {
  todo: '#888780',
  in_progress: '#185fa5',
  done: '#3b6d11',
  hold: '#854f0b'
}

const calculateDDay = (dateStr: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'D-day'
  return `D-${diff}`
}

const getDDayStyle = (dateStr: string) => {
  const diff = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 5) return { background: '#fcebeb', color: '#a32d2d' }
  if (diff <= 14) return { background: '#e6f1fb', color: '#185fa5' }
  return { background: '#f1efe8', color: '#5f5e5a' }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/ /g, '')
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'todo': '할 일',
    'in_progress': '진행 중',
    'done': '완료',
    'hold': '보류'
  }
  return labels[status] || status
}
</script>

<template>
  <div class="dashboard-root">
    <div class="dashboard-grid">
      <!-- Weather Card -->
      <div class="dashboard-card weather-card">
        <div class="card-label">🌤️ 부산 날씨</div>
        <div class="weather-row">
          <div>
            <div class="weather-big">{{ weatherData.temp }}°</div>
            <div class="weather-sub">{{ weatherData.condition }} · 체감 {{ weatherData.feelsLike }}°</div>
          </div>
          <div class="weather-icon">☀️</div>
        </div>
        <div class="weather-tags">
          <span class="weather-tag">습도 {{ weatherData.humidity }}%</span>
          <span class="weather-tag">바람 {{ weatherData.wind }}m/s</span>
          <span class="weather-tag">미세먼지 {{ weatherData.pm }}</span>
        </div>
      </div>

      <!-- Bus Card -->
      <div class="dashboard-card bus-card">
        <div class="card-label" style="color: #633806">🚌 버스 도착</div>
        <div
          v-for="(bus, idx) in busData"
          :key="idx"
          class="bus-row"
        >
          <div>
            <div class="bus-no">{{ bus.no }}</div>
            <div class="bus-time">{{ bus.direction }}</div>
          </div>
          <span class="bus-badge">{{ bus.time }}</span>
        </div>
      </div>

      <!-- D-Day Card -->
      <div class="dashboard-card dday-card">
        <div class="card-label">📆 마감 D-Day</div>
        <div class="dday-list">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
            class="dday-item"
          >
            <span class="dday-title">{{ event.title }}</span>
            <span class="dday-badge" :style="getDDayStyle(event.date)">
              {{ calculateDDay(event.date) }}
            </span>
          </div>
          <div v-if="upcomingEvents.length === 0" class="dday-empty">일정 없음</div>
        </div>
      </div>

      <!-- Bookmarks Card -->
      <div class="dashboard-card bookmark-card">
        <div class="card-label">📑 북마크</div>
        <div class="bookmark-grid">
          <a
            v-for="bookmark in bookmarkStore.bookmarks.slice(0, 8)"
            :key="bookmark.id"
            :href="bookmark.url"
            target="_blank"
            rel="noopener noreferrer"
            class="bookmark-item"
            :style="{ '--bg': BOOKMARK_COLORS[bookmark.category]?.bg || '#f5f4ef' } as any"
          >
            <div class="bookmark-icon">📌</div>
            <div class="bookmark-name">{{ bookmark.title }}</div>
            <div class="bookmark-cat">{{ bookmark.category }}</div>
          </a>
        </div>
      </div>

      <!-- Recent Memos Card -->
      <div class="dashboard-card memo-card">
        <div class="card-label">📝 최근 메모</div>
        <div class="memo-list">
          <NuxtLink
            v-for="memo in recentMemos"
            :key="memo.id"
            :to="`/memo?id=${memo.id}`"
            class="memo-item"
          >
            <div class="memo-title">{{ memo.title }}</div>
            <div class="memo-date">{{ formatDate(memo.createdAt) }}</div>
          </NuxtLink>
          <div v-if="recentMemos.length === 0" class="memo-empty">메모 없음</div>
        </div>
      </div>

      <!-- Kanban Card -->
      <div class="dashboard-card kanban-card">
        <div class="card-label">📋 칸반 보드</div>
        <div class="kanban-cols">
          <div
            v-for="status in ['todo', 'in_progress', 'done', 'hold']"
            :key="status"
            class="kanban-col"
            :class="`kanban-${status}`"
            :style="{ '--status-color': TASK_STATUS_COLORS[status] } as any"
          >
            <div class="kanban-col-header">
              <span class="kanban-col-title">{{ getStatusLabel(status) }}</span>
              <span class="kanban-count">{{ tasksByStatus[status as any]?.length || 0 }}</span>
            </div>
            <div
              v-for="task in (tasksByStatus[status as any] || []).slice(0, 2)"
              :key="task.id"
              class="kanban-task"
            >
              <div class="kanban-task-title">{{ task.title }}</div>
              <span
                v-if="task.priority"
                class="kanban-task-tag"
                :style="TAG_COLORS[task.priority] ? {
                  background: TAG_COLORS[task.priority].bg,
                  color: TAG_COLORS[task.priority].text
                } : {}"
              >
                {{ task.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-root { padding: 0; }
.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto auto; gap: 2.24rem; padding: 32px 32px 44.8px; max-width: 1760px; }
.dashboard-card { background: #fff; border-radius: 16px; border: 1.5px solid #e8e6df; padding: 25.6px; overflow: hidden; }
.card-label { font-size: 1.76rem; font-weight: 500; color: #b4b2a9; letter-spacing: 0.96px; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 9.6px; }
.weather-card { background: #5b58e8; border-color: #4a47d0; color: #fff; }
.card-label { color: rgba(255, 255, 255, 0.5); }
.weather-row { display: flex; justify-content: space-between; align-items: flex-end; }
.weather-big { font-size: 6.72rem; font-weight: 500; color: #fff; line-height: 1; }
.weather-sub { font-size: 2.08rem; color: rgba(255, 255, 255, 0.7); margin-top: 6.4px; }
.weather-icon { font-size: 7.68rem; color: rgba(255, 255, 255, 0.25); }
.weather-tags { display: flex; gap: 9.6px; margin-top: 19.2px; flex-wrap: wrap; }
.weather-tag { background: rgba(255, 255, 255, 0.18); border-radius: 20px; padding: 4.8px 16px; font-size: 1.92rem; color: #fff; }
.bus-card { background: #ffd166; border-color: #f0c040; }
.card-label { color: #633806 !important; }
.bus-row { display: flex; align-items: center; justify-content: space-between; padding: 12.8px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.06); }
.bus-row:last-child { border-bottom: none; }
.bus-no { font-size: 2.4rem; font-weight: 500; color: #412402; }
.bus-time { font-size: 2.08rem; color: #633806; }
.bus-badge { background: #fff; border-radius: 20px; padding: 3.2px 16px; font-size: 1.92rem; font-weight: 500; color: #412402; }
.dday-card {}
.dday-list { display: flex; flex-direction: column; gap: 12.8px; }
.dday-item { display: flex; align-items: center; justify-content: space-between; padding: 12.8px 16px; border-radius: 10px; background: #f5f4ef; }
.dday-title { font-size: 2.08rem; color: #2d2d2d; }
.dday-badge { font-size: 1.92rem; font-weight: 500; border-radius: 20px; padding: 3.2px 12.8px; }
.dday-empty { text-align: center; padding: 32px 0; color: #d3d1c7; font-size: 1.92rem; }
.bookmark-card { grid-column: 1 / 3; }
.bookmark-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12.8px; }
.bookmark-item { display: flex; flex-direction: column; align-items: center; gap: 9.6px; padding: 19.2px 12.8px; border-radius: 12px; background: var(--bg, #f5f4ef); cursor: pointer; transition: background 0.15s; text-decoration: none; color: inherit; }
.bookmark-item:hover { background: #eeedfe; }
.bookmark-icon { width: 57.6px; height: 57.6px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28.8px; }
.bookmark-name { font-size: 1.76rem; color: #5f5e5a; text-align: center; line-height: 1.3; }
.bookmark-cat { font-size: 1.6rem; color: #b4b2a9; margin-top: 1.6px; }
.memo-card {}
.memo-list { display: flex; flex-direction: column; gap: 9.6px; }
.memo-item { padding: 12.8px 16px; border-radius: 10px; background: #f5f4ef; cursor: pointer; border-left: 3px solid #cecbf6; text-decoration: none; color: inherit; transition: background 0.15s; }
.memo-item:hover { background: #eee; }
.memo-title { font-size: 2.08rem; color: #2d2d2d; font-weight: 500; }
.memo-date { font-size: 1.76rem; color: #b4b2a9; margin-top: 3.2px; }
.memo-empty { text-align: center; padding: 32px 0; color: #d3d1c7; font-size: 1.92rem; }
.kanban-card { grid-column: 1 / 4; }
.kanban-cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kanban-col { background: #f5f4ef; border-radius: 12px; padding: 16px; }
.kanban-col-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12.8px; }
.kanban-col-title { font-size: 1.92rem; font-weight: 500; color: var(--status-color, #888780); }
.kanban-count { font-size: 1.76rem; background: #fff; border-radius: 20px; padding: 1.6px 12.8px; color: #888780; }
.kanban-task { background: #fff; border-radius: 8px; padding: 14.4px 16px; margin-bottom: 9.6px; border: 1.5px solid #e8e6df; cursor: grab; }
.kanban-task:last-child { margin-bottom: 0; }
.kanban-task-title { font-size: 2.08rem; color: #2d2d2d; }
.kanban-task-tag { display: inline-block; margin-top: 8px; font-size: 1.76rem; border-radius: 20px; padding: 1.6px 12.8px; }
</style>

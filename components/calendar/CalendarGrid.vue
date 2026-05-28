<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '~/stores/useEventStore'

interface Props {
  year: number
  month: number
  selectedDate: string
  events: Event[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  selectDate: [date: string]
}>()

const today = new Date()

const calendarCells = computed(() => {
  const firstDay = new Date(props.year, props.month, 1)
  const lastDay = new Date(props.year, props.month + 1, 0)
  const startDow = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const daysInPrevMonth = new Date(props.year, props.month, 0).getDate()

  const cells: Array<{ day: number; isCurrentMonth: boolean; dateStr: string }> = []

  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false, dateStr: '' })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${props.year}-${String(props.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, isCurrentMonth: true, dateStr })
  }

  const remaining = (7 - (cells.length % 7)) % 7
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, dateStr: '' })
  }

  return cells
})

const isToday = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return (
    y === today.getFullYear() &&
    m === today.getMonth() + 1 &&
    d === today.getDate()
  )
}

const isSelected = (dateStr: string) => {
  return dateStr === props.selectedDate
}

const getEventsForDate = (dateStr: string) => {
  return props.events.filter(e => e.date === dateStr).slice(0, 2)
}

const hasMoreEvents = (dateStr: string) => {
  const count = props.events.filter(e => e.date === dateStr).length
  return count > 2
}

const getMoreCount = (dateStr: string) => {
  const count = props.events.filter(e => e.date === dateStr).length
  return Math.max(0, count - 2)
}
</script>

<template>
  <div class="cal-grid">
    <div class="cal-dow">
      <div class="cal-dow-cell" style="color: #e24b4a">일</div>
      <div class="cal-dow-cell">월</div>
      <div class="cal-dow-cell">화</div>
      <div class="cal-dow-cell">수</div>
      <div class="cal-dow-cell">목</div>
      <div class="cal-dow-cell">금</div>
      <div class="cal-dow-cell" style="color: #4dabf7">토</div>
    </div>
    <div class="cal-body">
      <div
        v-for="(cell, idx) in calendarCells"
        :key="idx"
        :class="[
          'cal-cell',
          { 'other-month': !cell.isCurrentMonth },
          { 'today': cell.isCurrentMonth && isToday(cell.dateStr) },
          { 'selected': isSelected(cell.dateStr) }
        ]"
        @click="cell.isCurrentMonth && emit('selectDate', cell.dateStr)"
      >
        <div class="cal-day">{{ cell.day }}</div>
        <div
          v-for="evt in getEventsForDate(cell.dateStr)"
          :key="evt.id"
          class="cal-evt-dot"
          :style="{ background: evt.color + '22', color: evt.color }"
        >
          {{ evt.title }}
        </div>
        <div v-if="hasMoreEvents(cell.dateStr)" class="cal-more">
          +{{ getMoreCount(cell.dateStr) }}개
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cal-grid { background: #fff; border-radius: 14px; border: 1.5px solid #e8e6df; overflow: hidden; }
.cal-dow { display: grid; grid-template-columns: repeat(7, 1fr); background: #f8f7f3; border-bottom: 1.5px solid #e8e6df; }
.cal-dow-cell { text-align: center; padding: 8px 0; font-size: 1.1rem; font-weight: 500; color: #888780; }
.cal-body { display: grid; grid-template-columns: repeat(7, 1fr); }
.cal-cell { min-height: 70px; padding: 6px; border-right: 0.5px solid #f0eee8; border-bottom: 0.5px solid #f0eee8; cursor: pointer; transition: background 0.1s; }
.cal-cell:hover { background: #fafafe; }
.cal-cell.other-month .cal-day { color: #d3d1c7; }
.cal-cell.today .cal-day { background: #5b58e8; color: #fff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
.cal-cell.selected { background: #fafafe; outline: 2px solid #5b58e8; outline-offset: -2px; border-radius: 4px; }
.cal-day { font-size: 1.2rem; color: #2d2d2d; font-weight: 500; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-bottom: 3px; }
.cal-cell:nth-child(7n+1) .cal-day { color: #e24b4a; }
.cal-cell.today .cal-day { color: #fff !important; }
.cal-evt-dot { font-size: 1.1rem; border-radius: 4px; padding: 1px 5px; margin-bottom: 2px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: pointer; }
.cal-more { font-size: 1rem; color: #b4b2a9; }
</style>

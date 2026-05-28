<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEventStore } from '~/stores/useEventStore'
import CalendarGrid from '~/components/calendar/CalendarGrid.vue'
import CalendarSidebar from '~/components/calendar/CalendarSidebar.vue'
import EventModal from '~/components/calendar/EventModal.vue'

definePageMeta({
  layout: 'default'
})

const eventStore = useEventStore()

const currentDate = ref(new Date())
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showModal = ref(false)

const currentMonth = computed(() => {
  return `${currentDate.value.getFullYear()}년 ${currentDate.value.getMonth() + 1}월`
})

const dayEventsForSelected = computed(() => {
  return eventStore.events.filter(e => e.date === selectedDate.value)
})

const monthEvents = computed(() => {
  const yearMonth = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}`
  return eventStore.events
    .filter(e => e.date.startsWith(yearMonth))
    .sort((a, b) => a.date.localeCompare(b.date))
})

onMounted(async () => {
  await eventStore.fetchEvents()
})

const handlePrevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const handleNextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const handleSelectDate = (date: string) => {
  selectedDate.value = date
}

const handleOpenModal = () => {
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
}

const handleAddEvent = async (eventData: { title: string; color: string; memo: string }) => {
  await eventStore.addEvent({
    title: eventData.title,
    date: selectedDate.value,
    color: eventData.color,
    memo: eventData.memo
  })
  handleCloseModal()
}

const handleDeleteEvent = async (id: number) => {
  await eventStore.deleteEvent(id)
}
</script>

<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <div class="calendar-title">
        <span class="calendar-icon">📅</span>
        <h1>업무 캘린더</h1>
      </div>
      <div class="calendar-nav">
        <button class="cal-nav-btn" @click="handlePrevMonth" aria-label="이전 달">◀</button>
        <span class="calendar-month">{{ currentMonth }}</span>
        <button class="cal-nav-btn" @click="handleNextMonth" aria-label="다음 달">▶</button>
      </div>
    </div>

    <div class="calendar-layout">
      <CalendarGrid
        :year="currentDate.getFullYear()"
        :month="currentDate.getMonth()"
        :selected-date="selectedDate"
        :events="eventStore.events"
        @select-date="handleSelectDate"
      />
      <CalendarSidebar
        :selected-date="selectedDate"
        :day-events="dayEventsForSelected"
        :month-events="monthEvents"
        @open-modal="handleOpenModal"
        @delete-event="handleDeleteEvent"
      />
    </div>

    <EventModal
      v-if="showModal"
      :selected-date="selectedDate"
      @close="handleCloseModal"
      @add-event="handleAddEvent"
    />
  </div>
</template>

<style scoped>
.calendar-page { padding: 20px; }
.calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.calendar-title { display: flex; align-items: center; gap: 8px; }
.calendar-icon { font-size: 2.88rem; }
.calendar-title h1 { font-size: 3.2rem; font-weight: 600; color: #2d2d2d; margin: 0; }
.calendar-nav { display: flex; align-items: center; gap: 10px; }
.cal-nav-btn { background: #fff; border: 1.5px solid #e8e6df; border-radius: 8px; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #888780; font-size: 1.4rem; transition: all 0.15s; }
.cal-nav-btn:hover { border-color: #cecbf6; color: #5b58e8; }
.calendar-month { font-size: 1.5rem; font-weight: 500; color: #2d2d2d; min-width: 110px; text-align: center; }
.calendar-layout { display: grid; grid-template-columns: 1fr 220px; gap: 14px; }
</style>

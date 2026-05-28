<script setup lang="ts">
</script>

<template>
  <div class="app-root">
    <header class="app-header">
      <div class="header-logo">
        <div class="logo-dot" />
        <span>PocketDesk</span>
      </div>
      <nav class="header-nav">
        <NuxtLink to="/" aria-label="대시보드">🏠Home</NuxtLink>
        <NuxtLink to="/bookmark" aria-label="북마크">📑 Bookmark</NuxtLink>
        <NuxtLink to="/memo" aria-label="메모">📝 Memo</NuxtLink>
        <NuxtLink to="/calendar" aria-label="캘린더">📅 Calendar</NuxtLink>
        <NuxtLink to="/kanban" aria-label="칸반">📋 Board</NuxtLink>
      </nav>
    </header>

    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-root { background: #f5f4ef; min-height: 100vh; }
.app-header { background: #fff; border-bottom: 1.5px solid #e8e6df; padding: 0 38.4px; height: 83.2px; display: flex; align-items: center; justify-content: space-between; }
.header-logo { font-size: 25.6px; font-weight: 500; color: #3d3be8; letter-spacing: -0.48px; display: flex; align-items: center; gap: 12.8px; }
.logo-dot { width: 12.8px; height: 12.8px; background: #ffd166; border-radius: 50%; }
.header-nav { display: flex; align-items: center; gap: 25.6px; font-size: 2.88rem; }
.header-nav a { text-decoration: none; transition: transform 0.15s; font-size: 1.6rem; font-weight: 600; }
.header-nav a:hover { transform: scale(1.1); }
.app-main { }
</style>

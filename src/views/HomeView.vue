<script setup lang="ts">
import UserSearch from '@/components/UserSearch.vue'

defineOptions({ name: 'HomeView' })
</script>

<template>
  <main class="home-view">
    <div class="hero">
      <div class="hero-icon">♟</div>
      <h1 class="hero-title">Chess Analysis</h1>
      <p class="hero-subtitle">
        Analyze your Lichess games. Explore your openings, performance by time control, and more.
      </p>
      <UserSearch />
    </div>
  </main>
</template>

<style scoped>
.home-view {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  max-width: 560px;
  width: 100%;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.75rem;
}

.hero-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0 0 2rem;
  line-height: 1.6;
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'NotFoundView' })

const router = useRouter()

function goHome(): void {
  void router.push({ name: 'home' })
}
</script>

<template>
  <main class="not-found-view">
    <div class="content">
      <p class="code">404</p>
      <h1 class="title">Page Not Found</h1>
      <p class="description">The page you're looking for doesn't exist.</p>
      <button class="home-btn" @click="goHome">Go Home</button>
    </div>
  </main>
</template>

<style scoped>
.not-found-view {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.content {
  max-width: 400px;
}

.code {
  font-size: 6rem;
  font-weight: 800;
  color: #e5e7eb;
  margin: 0;
  line-height: 1;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0.5rem 0;
}

.description {
  color: #6b7280;
  margin: 0 0 1.5rem;
}

.home-btn {
  padding: 0.625rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.home-btn:hover {
  background: #2563eb;
}
</style>

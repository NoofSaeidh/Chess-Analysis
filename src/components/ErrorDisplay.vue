<script setup lang="ts">
defineOptions({ name: 'ErrorDisplay' })

defineProps<{
  message: string
  title?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-display" role="alert">
    <div class="error-icon">⚠️</div>
    <h3 class="error-title">{{ title ?? 'Something went wrong' }}</h3>
    <p class="error-message">{{ message }}</p>
    <button class="retry-btn" @click="$emit('retry')">Try Again</button>
  </div>
</template>

<style scoped>
.error-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  border-radius: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  text-align: center;
}

.error-icon {
  font-size: 2rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.error-message {
  margin: 0;
  font-size: 0.9rem;
  color: #b91c1c;
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  background: #ef4444;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #dc2626;
}
</style>

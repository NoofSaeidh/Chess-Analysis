<script setup lang="ts">
defineOptions({ name: 'LoadingSpinner' })

withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    label?: string
  }>(),
  {
    size: 'md',
    label: 'Loading...',
  },
)
</script>

<template>
  <div class="spinner-wrapper" role="status" :aria-label="label">
    <div :class="['spinner', `spinner--${size}`]" />
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-color: #e2e8f0 #e2e8f0 #e2e8f0 #3b82f6;
  animation: spin 0.75s linear infinite;
}

.spinner--sm {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.spinner--md {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.spinner--lg {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

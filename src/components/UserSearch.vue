<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

defineOptions({ name: 'UserSearch' })

const props = withDefaults(
  defineProps<{
    initialUsername?: string
    loading?: boolean
  }>(),
  {
    initialUsername: '',
    loading: false,
  },
)

const emit = defineEmits<{
  search: [username: string]
}>()

const router = useRouter()
const { username, usernameError, isSearching, search } = useSearch()

username.value = props.initialUsername

async function handleSubmit(): Promise<void> {
  const success = await search(username.value)
  if (success) {
    emit('search', username.value.trim())
    await router.push({ name: 'analysis', params: { username: username.value.trim() } })
  }
}
</script>

<template>
  <form class="user-search" novalidate @submit.prevent="handleSubmit">
    <div class="search-group">
      <label for="username-input" class="search-label">Lichess Username</label>
      <div class="search-input-wrapper">
        <input
          id="username-input"
          v-model="username"
          type="text"
          class="search-input"
          :class="{ 'search-input--error': usernameError !== null }"
          placeholder="e.g. magnus"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          :disabled="isSearching || loading"
          :aria-describedby="usernameError !== null ? 'username-error' : undefined"
          :aria-invalid="usernameError !== null"
        />
        <button
          type="submit"
          class="search-btn"
          :disabled="isSearching || loading || username.trim() === ''"
        >
          <span v-if="isSearching || loading">Searching…</span>
          <span v-else>Analyze</span>
        </button>
      </div>
      <p v-if="usernameError !== null" id="username-error" class="field-error" role="alert">
        {{ usernameError }}
      </p>
    </div>
  </form>
</template>

<style scoped>
.user-search {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.search-input--error {
  border-color: #ef4444;
}

.search-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.search-btn {
  padding: 0.625rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.search-btn:hover:not(:disabled) {
  background: #2563eb;
}

.search-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.field-error {
  margin: 0.375rem 0 0;
  font-size: 0.8rem;
  color: #ef4444;
}
</style>

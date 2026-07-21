import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import { isValidUsername } from '@/utils/format'

export interface UseSearchReturn {
  username: ReturnType<typeof ref<string>>
  usernameError: ReturnType<typeof ref<string | null>>
  isSearching: ReturnType<typeof ref<boolean>>
  search: (value: string) => Promise<boolean>
  validate: (value: string) => boolean
}

export function useSearch(): UseSearchReturn {
  const userStore = useUserStore()
  const analysisStore = useAnalysisStore()

  const username = ref('')
  const usernameError = ref<string | null>(null)
  const isSearching = ref(false)

  function validate(value: string): boolean {
    if (value.trim() === '') {
      usernameError.value = 'Username is required'
      return false
    }
    if (!isValidUsername(value.trim())) {
      usernameError.value = 'Invalid username format'
      return false
    }
    usernameError.value = null
    return true
  }

  async function search(value: string): Promise<boolean> {
    if (!validate(value)) {
      return false
    }
    const trimmed = value.trim()
    isSearching.value = true
    analysisStore.reset()
    try {
      await userStore.fetchUser(trimmed)
      if (userStore.userError !== null) {
        usernameError.value = userStore.userError
        return false
      }
      await userStore.fetchGames(trimmed)
      return userStore.gamesError === null
    } finally {
      isSearching.value = false
    }
  }

  return { username, usernameError, isSearching, search, validate }
}

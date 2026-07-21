import { defineStore } from 'pinia'
import { ref } from 'vue'
import { lichessApi } from '@/api/lichess'
import type { LichessGame, LichessUser } from '@/types/lichess'

export const useUserStore = defineStore('user', () => {
  const user = ref<LichessUser | null>(null)
  const games = ref<LichessGame[]>([])
  const isLoadingUser = ref(false)
  const isLoadingGames = ref(false)
  const userError = ref<string | null>(null)
  const gamesError = ref<string | null>(null)

  async function fetchUser(username: string): Promise<void> {
    isLoadingUser.value = true
    userError.value = null
    try {
      user.value = await lichessApi.getUser(username)
    } catch (error) {
      userError.value = error instanceof Error ? error.message : 'Unknown error'
      user.value = null
    } finally {
      isLoadingUser.value = false
    }
  }

  async function fetchGames(username: string, max = 100): Promise<void> {
    isLoadingGames.value = true
    gamesError.value = null
    games.value = []
    try {
      games.value = await lichessApi.getUserGames(username, { max, opening: true })
    } catch (error) {
      gamesError.value = error instanceof Error ? error.message : 'Unknown error'
      games.value = []
    } finally {
      isLoadingGames.value = false
    }
  }

  function reset(): void {
    user.value = null
    games.value = []
    userError.value = null
    gamesError.value = null
    isLoadingUser.value = false
    isLoadingGames.value = false
  }

  return {
    user,
    games,
    isLoadingUser,
    isLoadingGames,
    userError,
    gamesError,
    fetchUser,
    fetchGames,
    reset,
  }
})

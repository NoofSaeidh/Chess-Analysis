import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { lichessApi } from '@/api/lichess'
import type { LichessGame, LichessUser } from '@/types/lichess'

vi.mock('@/api/lichess', () => ({
  lichessApi: {
    getUser: vi.fn(),
    getUserGames: vi.fn(),
  },
}))

function makeUser(): LichessUser {
  return {
    id: 'testuser',
    username: 'TestUser',
    createdAt: 1_000_000_000,
    seenAt: 1_700_000_000,
    url: 'https://lichess.org/@/TestUser',
    count: {
      all: 10, rated: 8, ai: 0, draw: 2, drawH: 1,
      loss: 3, lossH: 2, win: 5, winH: 4,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

function makeGame(): LichessGame {
  return {
    id: 'g1',
    rated: true,
    variant: 'standard',
    speed: 'blitz',
    perf: 'blitz',
    createdAt: 1_700_000_000_000,
    lastMoveAt: 1_700_000_060_000,
    status: 'mate',
    players: {
      white: { user: { name: 'TestUser', id: 'testuser' }, rating: 1500 },
      black: { user: { name: 'Opponent', id: 'opponent' }, rating: 1490 },
    },
    winner: 'white',
  }
}

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchUser', () => {
    it('sets user on success', async () => {
      const user = makeUser()
      vi.mocked(lichessApi.getUser).mockResolvedValue(user)
      const store = useUserStore()
      await store.fetchUser('TestUser')
      expect(store.user).toEqual(user)
      expect(store.userError).toBeNull()
      expect(store.isLoadingUser).toBe(false)
    })

    it('sets userError on failure', async () => {
      vi.mocked(lichessApi.getUser).mockRejectedValue(new Error('User not found'))
      const store = useUserStore()
      await store.fetchUser('unknown')
      expect(store.user).toBeNull()
      expect(store.userError).toBe('User not found')
      expect(store.isLoadingUser).toBe(false)
    })

    it('sets isLoadingUser during fetch', async () => {
      let resolveUser!: (u: LichessUser) => void
      const pendingUser = new Promise<LichessUser>((r) => { resolveUser = r })
      vi.mocked(lichessApi.getUser).mockReturnValue(pendingUser)
      const store = useUserStore()
      const fetchPromise = store.fetchUser('TestUser')
      expect(store.isLoadingUser).toBe(true)
      resolveUser(makeUser())
      await fetchPromise
      expect(store.isLoadingUser).toBe(false)
    })
  })

  describe('fetchGames', () => {
    it('sets games on success', async () => {
      const games = [makeGame()]
      vi.mocked(lichessApi.getUserGames).mockResolvedValue(games)
      const store = useUserStore()
      await store.fetchGames('TestUser')
      expect(store.games).toEqual(games)
      expect(store.gamesError).toBeNull()
      expect(store.gamesUsername).toBe('testuser')
    })

    it('sets gamesError on failure', async () => {
      vi.mocked(lichessApi.getUserGames).mockRejectedValue(new Error('Failed'))
      const store = useUserStore()
      await store.fetchGames('TestUser')
      expect(store.games).toHaveLength(0)
      expect(store.gamesError).toBe('Failed')
      expect(store.gamesUsername).toBeNull()
    })
  })

  describe('reset', () => {
    it('clears all state', async () => {
      const user = makeUser()
      vi.mocked(lichessApi.getUser).mockResolvedValue(user)
      vi.mocked(lichessApi.getUserGames).mockResolvedValue([makeGame()])
      const store = useUserStore()
      await store.fetchUser('TestUser')
      await store.fetchGames('TestUser')
      store.reset()
      expect(store.user).toBeNull()
      expect(store.games).toHaveLength(0)
      expect(store.gamesUsername).toBeNull()
      expect(store.userError).toBeNull()
      expect(store.gamesError).toBeNull()
    })
  })
})

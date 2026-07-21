import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearch } from '@/composables/useSearch'
import { lichessApi } from '@/api/lichess'
import type { LichessUser } from '@/types/lichess'

vi.mock('@/api/lichess', () => ({
  lichessApi: {
    getUser: vi.fn(),
    getUserGames: vi.fn(),
  },
}))

function makeUser(): LichessUser {
  return {
    id: 'magnus',
    username: 'Magnus',
    createdAt: 1_000_000_000,
    seenAt: 1_700_000_000,
    url: 'https://lichess.org/@/Magnus',
    count: {
      all: 100, rated: 90, ai: 0, draw: 10, drawH: 8,
      loss: 30, lossH: 28, win: 60, winH: 55,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

describe('useSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('validate', () => {
    it('returns false and sets error for empty username', () => {
      const { validate, usernameError } = useSearch()
      expect(validate('')).toBe(false)
      expect(usernameError.value).toBe('Username is required')
    })

    it('returns false for invalid username format', () => {
      const { validate, usernameError } = useSearch()
      expect(validate('123invalid')).toBe(false)
      expect(usernameError.value).toBe('Invalid username format')
    })

    it('returns true for valid username', () => {
      const { validate, usernameError } = useSearch()
      expect(validate('magnus')).toBe(true)
      expect(usernameError.value).toBeNull()
    })
  })

  describe('search', () => {
    it('returns false for empty username', async () => {
      const { search } = useSearch()
      const result = await search('')
      expect(result).toBe(false)
    })

    it('returns true on successful search', async () => {
      vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
      vi.mocked(lichessApi.getUserGames).mockResolvedValue([])
      const { search } = useSearch()
      const result = await search('magnus')
      expect(result).toBe(true)
    })

    it('returns false when user not found', async () => {
      vi.mocked(lichessApi.getUser).mockRejectedValue(new Error('User not found'))
      const { search, usernameError } = useSearch()
      const result = await search('unknown')
      expect(result).toBe(false)
      expect(usernameError.value).toBe('User not found')
    })

    it('sets isSearching during search', async () => {
      let resolveUser!: (u: LichessUser) => void
      const pendingUser = new Promise<LichessUser>((r) => { resolveUser = r })
      vi.mocked(lichessApi.getUser).mockReturnValue(pendingUser)
      vi.mocked(lichessApi.getUserGames).mockResolvedValue([])
      const { search, isSearching } = useSearch()
      const searchPromise = search('magnus')
      expect(isSearching.value).toBe(true)
      resolveUser(makeUser())
      await searchPromise
      expect(isSearching.value).toBe(false)
    })
  })
})

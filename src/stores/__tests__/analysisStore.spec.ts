import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useUserStore } from '@/stores/userStore'
import { lichessApi } from '@/api/lichess'
import type { LichessGame, LichessUser } from '@/types/lichess'

vi.mock('@/api/lichess', () => ({
  lichessApi: {
    getUser: vi.fn(),
    getUserGames: vi.fn(),
  },
}))

function makeUser(username = 'Alice'): LichessUser {
  return {
    id: username.toLowerCase(),
    username,
    createdAt: 1_000_000_000,
    seenAt: 1_700_000_000,
    url: `https://lichess.org/@/${username}`,
    count: {
      all: 2, rated: 2, ai: 0, draw: 0, drawH: 0,
      loss: 1, lossH: 1, win: 1, winH: 1,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

function makeGame(id: string, winner: 'white' | 'black' | 'draw' = 'white'): LichessGame {
  return {
    id,
    rated: true,
    variant: 'standard',
    speed: 'blitz',
    perf: 'blitz',
    createdAt: 1_700_000_000_000,
    lastMoveAt: 1_700_000_060_000,
    status: winner !== 'draw' ? 'mate' : 'draw',
    players: {
      white: { user: { name: 'Alice', id: 'alice' }, rating: 1500, ratingDiff: 5 },
      black: { user: { name: 'Bob', id: 'bob' }, rating: 1490, ratingDiff: -5 },
    },
    winner: winner === 'draw' ? undefined : winner,
    opening: { eco: 'E04', name: 'Catalan', ply: 8 },
  }
}

describe('useAnalysisStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('analyses is empty when no user is set', () => {
    const analysisStore = useAnalysisStore()
    expect(analysisStore.analyses).toHaveLength(0)
  })

  it('summary is null when no user is set', () => {
    const analysisStore = useAnalysisStore()
    expect(analysisStore.summary).toBeNull()
  })

  it('computes analyses from user games', async () => {
    vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([makeGame('g1'), makeGame('g2', 'black')])
    const userStore = useUserStore()
    const analysisStore = useAnalysisStore()
    await userStore.fetchUser('Alice')
    await userStore.fetchGames('Alice')
    expect(analysisStore.analyses).toHaveLength(2)
    expect(analysisStore.analyses[0]?.result).toBe('win')
    expect(analysisStore.analyses[1]?.result).toBe('loss')
  })

  it('computes summary with correct stats', async () => {
    vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([
      makeGame('g1', 'white'),
      makeGame('g2', 'black'),
      makeGame('g3', 'draw'),
    ])
    const userStore = useUserStore()
    const analysisStore = useAnalysisStore()
    await userStore.fetchUser('Alice')
    await userStore.fetchGames('Alice')
    const summary = analysisStore.summary
    expect(summary?.totalGames).toBe(3)
    expect(summary?.overall.wins).toBe(1)
    expect(summary?.overall.losses).toBe(1)
    expect(summary?.overall.draws).toBe(1)
  })

  it('selectPerfType filters analyses', async () => {
    const blitzGame = makeGame('g1')
    const rapidGame: LichessGame = { ...makeGame('g2'), speed: 'rapid', perf: 'rapid' }
    vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([blitzGame, rapidGame])
    const userStore = useUserStore()
    const analysisStore = useAnalysisStore()
    await userStore.fetchUser('Alice')
    await userStore.fetchGames('Alice')
    analysisStore.selectPerfType('rapid')
    expect(analysisStore.analyses).toHaveLength(1)
    expect(analysisStore.analyses[0]?.game.speed).toBe('rapid')
  })

  it('reset clears selectedPerfType', () => {
    const analysisStore = useAnalysisStore()
    analysisStore.selectPerfType('blitz')
    analysisStore.reset()
    expect(analysisStore.selectedPerfType).toBeNull()
  })
})

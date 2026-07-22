import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCharts } from '@/composables/useCharts'
import { useUserStore } from '@/stores/userStore'
import { useAnalysisStore } from '@/stores/analysisStore'
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
    id: 'alice',
    username: 'Alice',
    createdAt: 1_000_000_000,
    seenAt: 1_700_000_000,
    url: 'https://lichess.org/@/Alice',
    count: {
      all: 2, rated: 2, ai: 0, draw: 0, drawH: 0,
      loss: 1, lossH: 1, win: 1, winH: 1,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

function makeGame(id: string, winner: 'white' | 'black' | undefined): LichessGame {
  return {
    id,
    rated: true,
    variant: 'standard',
    speed: 'blitz',
    perf: 'blitz',
    createdAt: 1_700_000_000_000,
    lastMoveAt: 1_700_000_060_000,
    status: winner !== undefined ? 'mate' : 'draw',
    players: {
      white: { user: { name: 'Alice', id: 'alice' }, rating: 1500, ratingDiff: 5 },
      black: { user: { name: 'Bob', id: 'bob' }, rating: 1490, ratingDiff: -5 },
    },
    winner,
    opening: { eco: 'E04', name: 'Catalan', ply: 8 },
  }
}

describe('useCharts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('overallChartData is null when no summary', () => {
    const { overallChartData } = useCharts()
    expect(overallChartData.value).toBeNull()
  })

  it('speedChartData is null when no summary', () => {
    const { speedChartData } = useCharts()
    expect(speedChartData.value).toBeNull()
  })

  it('openingsChartData is null when no summary', () => {
    const { openingsChartData } = useCharts()
    expect(openingsChartData.value).toBeNull()
  })

  it('ratingChartData is null when no summary', () => {
    const { ratingChartData } = useCharts()
    expect(ratingChartData.value).toBeNull()
  })

  it('colorChartData returns null when no summary', () => {
    const { colorChartData } = useCharts()
    expect(colorChartData('white')).toBeNull()
  })

  describe('with loaded data', () => {
    async function loadData(): Promise<void> {
      vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
      vi.mocked(lichessApi.getUserGames).mockResolvedValue([
        makeGame('g1', 'white'),
        makeGame('g2', 'black'),
      ])
      const userStore = useUserStore()
      await userStore.fetchUser('Alice')
      await userStore.fetchGames('Alice')
    }

    it('overallChartData has correct structure', async () => {
      await loadData()
      const { overallChartData } = useCharts()
      expect(overallChartData.value).not.toBeNull()
      expect(overallChartData.value?.labels).toEqual(['Wins', 'Losses', 'Draws'])
      expect(overallChartData.value?.datasets).toHaveLength(1)
    })

    it('colorChartData returns data for white', async () => {
      await loadData()
      const { colorChartData } = useCharts()
      const data = colorChartData('white')
      expect(data).not.toBeNull()
      expect(data?.labels).toEqual(['Wins', 'Losses', 'Draws'])
    })

    it('speedChartData has speeds as labels', async () => {
      await loadData()
      const { speedChartData } = useCharts()
      expect(speedChartData.value).not.toBeNull()
      expect(speedChartData.value?.labels).toContain('blitz')
    })

    it('openingsChartData has ECO codes as labels', async () => {
      await loadData()
      const { openingsChartData } = useCharts()
      expect(openingsChartData.value).not.toBeNull()
      expect(openingsChartData.value?.labels).toContain('E04')
    })

    it('ratingChartData has rating data', async () => {
      await loadData()
      const { ratingChartData } = useCharts()
      expect(ratingChartData.value).not.toBeNull()
      expect(ratingChartData.value?.datasets[0]?.data).toContain(1500)
    })

    it('colorChartData returns data for black', async () => {
      await loadData()
      const { colorChartData } = useCharts()
      const data = colorChartData('black')
      expect(data).not.toBeNull()
      expect(data?.datasets[0]?.label).toContain('Black')
    })

    it('analysisStore summary is populated', async () => {
      await loadData()
      const analysisStore = useAnalysisStore()
      expect(analysisStore.summary).not.toBeNull()
    })
  })
})

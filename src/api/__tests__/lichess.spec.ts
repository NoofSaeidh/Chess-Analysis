import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import type { AxiosStatic } from 'axios'
import { LichessApiClient, LichessApiError } from '@/api/lichess'
import type { LichessUser, LichessGame } from '@/types/lichess'

vi.mock('axios', async () => {
  const actual = await vi.importActual<{ default: AxiosStatic }>('axios')
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        get: vi.fn(),
      })),
      isAxiosError: actual.default.isAxiosError,
    },
  }
})

function makeMockHttp(): { get: ReturnType<typeof vi.fn> } {
  return { get: vi.fn() }
}

function makeUser(): LichessUser {
  return {
    id: 'magnus',
    username: 'Magnus',
    createdAt: 1_000_000_000,
    seenAt: 1_700_000_000,
    url: 'https://lichess.org/@/Magnus',
    count: {
      all: 100, rated: 80, ai: 5, draw: 10, drawH: 8,
      loss: 30, lossH: 28, win: 60, winH: 55,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

function makeGame(): LichessGame {
  return {
    id: 'abc123',
    rated: true,
    variant: 'standard',
    speed: 'blitz',
    perf: 'blitz',
    createdAt: 1_700_000_000_000,
    lastMoveAt: 1_700_000_060_000,
    status: 'mate',
    players: {
      white: { user: { name: 'Magnus', id: 'magnus' }, rating: 2800 },
      black: { user: { name: 'opponent', id: 'opponent' }, rating: 2700 },
    },
    winner: 'white',
  }
}

describe('LichessApiClient', () => {
  let mockHttp: ReturnType<typeof makeMockHttp>
  let client: LichessApiClient

  beforeEach(() => {
    mockHttp = makeMockHttp()
    vi.mocked(axios.create).mockReturnValue(mockHttp as never)
    client = new LichessApiClient('https://lichess.org')
  })

  describe('getUser', () => {
    it('returns user data on success', async () => {
      const user = makeUser()
      mockHttp.get.mockResolvedValue({ data: user })
      const result = await client.getUser('Magnus')
      expect(result).toEqual(user)
      expect(mockHttp.get).toHaveBeenCalledWith('/api/user/Magnus')
    })

    it('throws LichessApiError with 404 on not found', async () => {
      const axiosError = { response: { status: 404, statusText: 'Not Found' }, isAxiosError: true }
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
      mockHttp.get.mockRejectedValue(axiosError)
      await expect(client.getUser('unknown')).rejects.toThrow(LichessApiError)
      await expect(client.getUser('unknown')).rejects.toMatchObject({ statusCode: 404 })
    })

    it('throws LichessApiError for other axios errors', async () => {
      const axiosError = { response: { status: 500, statusText: 'Server Error' }, isAxiosError: true }
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
      mockHttp.get.mockRejectedValue(axiosError)
      await expect(client.getUser('user')).rejects.toThrow(LichessApiError)
    })

    it('throws LichessApiError for non-axios errors', async () => {
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)
      mockHttp.get.mockRejectedValue(new Error('Network error'))
      await expect(client.getUser('user')).rejects.toThrow(LichessApiError)
    })
  })

  describe('getUserGames', () => {
    it('returns parsed NDJSON games', async () => {
      const game = makeGame()
      const ndjson = JSON.stringify(game) + '\n'
      mockHttp.get.mockResolvedValue({ data: ndjson })
      const result = await client.getUserGames('magnus')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(game)
    })

    it('returns empty array for empty response', async () => {
      mockHttp.get.mockResolvedValue({ data: '' })
      const result = await client.getUserGames('magnus')
      expect(result).toHaveLength(0)
    })

    it('returns multiple games from multi-line NDJSON', async () => {
      const game1 = makeGame()
      const game2 = { ...makeGame(), id: 'xyz789' }
      const ndjson = JSON.stringify(game1) + '\n' + JSON.stringify(game2) + '\n'
      mockHttp.get.mockResolvedValue({ data: ndjson })
      const result = await client.getUserGames('magnus')
      expect(result).toHaveLength(2)
    })

    it('throws LichessApiError on 404', async () => {
      const axiosError = { response: { status: 404, statusText: 'Not Found' }, isAxiosError: true }
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
      mockHttp.get.mockRejectedValue(axiosError)
      await expect(client.getUserGames('unknown')).rejects.toThrow(LichessApiError)
    })

    it('throws LichessApiError for non-axios errors', async () => {
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)
      mockHttp.get.mockRejectedValue(new Error('Network error'))
      await expect(client.getUserGames('user')).rejects.toThrow(LichessApiError)
    })
  })
})

describe('LichessApiError', () => {
  it('sets name to LichessApiError', () => {
    const error = new LichessApiError('test')
    expect(error.name).toBe('LichessApiError')
  })

  it('stores statusCode', () => {
    const error = new LichessApiError('test', 404)
    expect(error.statusCode).toBe(404)
  })
})

import { describe, it, expect } from 'vitest'
import {
  buildGameAnalyses,
  buildRatingHistory,
  computeOpeningStats,
  computeOpponentStats,
  computeSpeedStats,
  computeWinLossDraw,
  getGameResult,
  getPlayerColor,
} from '@/utils/analysis'
import type { LichessGame } from '@/types/lichess'
import type { GameAnalysis } from '@/types/analysis'

function makeGame(overrides: Partial<LichessGame> = {}): LichessGame {
  return {
    id: 'game1',
    rated: true,
    variant: 'standard',
    speed: 'blitz',
    perf: 'blitz',
    createdAt: 1_700_000_000_000,
    lastMoveAt: 1_700_000_060_000,
    status: 'mate',
    players: {
      white: {
        user: { name: 'Alice', id: 'alice' },
        rating: 1500,
        ratingDiff: 5,
      },
      black: {
        user: { name: 'Bob', id: 'bob' },
        rating: 1490,
        ratingDiff: -5,
      },
    },
    winner: 'white',
    opening: { eco: 'E04', name: "Catalan Opening: Open Defense", ply: 8 },
    ...overrides,
  }
}

function makeAnalysis(overrides: Partial<GameAnalysis> = {}): GameAnalysis {
  return {
    game: makeGame(),
    result: 'win',
    playerColor: 'white',
    opponentName: 'Bob',
    opponentRating: 1490,
    ratingChange: 5,
    ...overrides,
  }
}

describe('getPlayerColor', () => {
  it('returns white when the player is white', () => {
    const game = makeGame()
    expect(getPlayerColor(game, 'alice')).toBe('white')
  })

  it('returns black when the player is black', () => {
    const game = makeGame()
    expect(getPlayerColor(game, 'bob')).toBe('black')
  })

  it('is case-insensitive', () => {
    const game = makeGame()
    expect(getPlayerColor(game, 'ALICE')).toBe('white')
  })

  it('returns null when player is not in game', () => {
    const game = makeGame()
    expect(getPlayerColor(game, 'charlie')).toBeNull()
  })
})

describe('getGameResult', () => {
  it('returns win when player won', () => {
    const game = makeGame({ winner: 'white' })
    expect(getGameResult(game, 'white')).toBe('win')
  })

  it('returns loss when player lost', () => {
    const game = makeGame({ winner: 'white' })
    expect(getGameResult(game, 'black')).toBe('loss')
  })

  it('returns draw when no winner', () => {
    const game = makeGame({ winner: undefined })
    expect(getGameResult(game, 'white')).toBe('draw')
  })
})

describe('computeWinLossDraw', () => {
  it('returns zeros for empty list', () => {
    const result = computeWinLossDraw([])
    expect(result.total).toBe(0)
    expect(result.wins).toBe(0)
    expect(result.winRate).toBe(0)
  })

  it('computes correct stats', () => {
    const analyses: GameAnalysis[] = [
      makeAnalysis({ result: 'win' }),
      makeAnalysis({ result: 'win' }),
      makeAnalysis({ result: 'loss' }),
      makeAnalysis({ result: 'draw' }),
    ]
    const result = computeWinLossDraw(analyses)
    expect(result.wins).toBe(2)
    expect(result.losses).toBe(1)
    expect(result.draws).toBe(1)
    expect(result.total).toBe(4)
    expect(result.winRate).toBeCloseTo(50)
    expect(result.lossRate).toBeCloseTo(25)
    expect(result.drawRate).toBeCloseTo(25)
  })
})

describe('buildGameAnalyses', () => {
  it('builds analyses from games', () => {
    const game = makeGame()
    const result = buildGameAnalyses([game], 'alice')
    expect(result).toHaveLength(1)
    expect(result[0]?.result).toBe('win')
    expect(result[0]?.playerColor).toBe('white')
    expect(result[0]?.opponentName).toBe('Bob')
  })

  it('skips games where user is not a player', () => {
    const game = makeGame()
    const result = buildGameAnalyses([game], 'charlie')
    expect(result).toHaveLength(0)
  })

  it('uses "AI" for unnamed opponents', () => {
    const game = makeGame({
      players: {
        white: { user: { name: 'Alice', id: 'alice' }, rating: 1500 },
        black: { aiLevel: 5 },
      },
    })
    const result = buildGameAnalyses([game], 'alice')
    expect(result[0]?.opponentName).toBe('AI')
  })
})

describe('computeSpeedStats', () => {
  it('returns empty array for no analyses', () => {
    expect(computeSpeedStats([])).toHaveLength(0)
  })

  it('groups by speed', () => {
    const analyses: GameAnalysis[] = [
      makeAnalysis({ game: makeGame({ speed: 'blitz' }), result: 'win' }),
      makeAnalysis({ game: makeGame({ speed: 'blitz' }), result: 'loss' }),
      makeAnalysis({ game: makeGame({ speed: 'bullet' }), result: 'win' }),
    ]
    const result = computeSpeedStats(analyses)
    expect(result).toHaveLength(2)
    const blitz = result.find((s) => s.speed === 'blitz')
    expect(blitz?.games).toBe(2)
    expect(blitz?.wins).toBe(1)
    expect(blitz?.losses).toBe(1)
  })

  it('includes average rating when available', () => {
    const game1 = makeGame()
    const game2 = makeGame()
    game2.players.white.rating = 1600
    const analyses: GameAnalysis[] = [
      makeAnalysis({ game: game1, playerColor: 'white' }),
      makeAnalysis({ game: game2, playerColor: 'white' }),
    ]
    const result = computeSpeedStats(analyses)
    expect(result[0]?.averageRating).toBe(1550)
  })
})

describe('computeOpeningStats', () => {
  it('returns empty array for no analyses', () => {
    expect(computeOpeningStats([])).toHaveLength(0)
  })

  it('skips games without opening', () => {
    const game = makeGame({ opening: undefined })
    const analyses = [makeAnalysis({ game })]
    expect(computeOpeningStats(analyses)).toHaveLength(0)
  })

  it('groups by ECO and sorts by game count', () => {
    const analyses: GameAnalysis[] = [
      makeAnalysis({ game: makeGame({ opening: { eco: 'B01', name: 'Scandinavian', ply: 2 } }), result: 'win' }),
      makeAnalysis({ game: makeGame({ opening: { eco: 'B01', name: 'Scandinavian', ply: 2 } }), result: 'loss' }),
      makeAnalysis({ game: makeGame({ opening: { eco: 'E04', name: 'Catalan', ply: 8 } }), result: 'win' }),
    ]
    const result = computeOpeningStats(analyses, 10)
    expect(result[0]?.eco).toBe('B01')
    expect(result[0]?.games).toBe(2)
  })

  it('respects topN limit', () => {
    const analyses: GameAnalysis[] = Array.from({ length: 15 }, (_, i) =>
      makeAnalysis({ game: makeGame({ opening: { eco: `A${String(i).padStart(2, '0')}`, name: `Opening ${String(i)}`, ply: 2 } }) }),
    )
    const result = computeOpeningStats(analyses, 5)
    expect(result).toHaveLength(5)
  })
})

describe('computeOpponentStats', () => {
  it('returns empty for no analyses', () => {
    expect(computeOpponentStats([])).toHaveLength(0)
  })

  it('groups by opponent name', () => {
    const analyses: GameAnalysis[] = [
      makeAnalysis({ opponentName: 'Bob', result: 'win' }),
      makeAnalysis({ opponentName: 'Bob', result: 'loss' }),
      makeAnalysis({ opponentName: 'Charlie', result: 'win' }),
    ]
    const result = computeOpponentStats(analyses, 10)
    expect(result[0]?.username).toBe('Bob')
    expect(result[0]?.games).toBe(2)
  })
})

describe('buildRatingHistory', () => {
  it('returns empty for no analyses', () => {
    expect(buildRatingHistory([])).toHaveLength(0)
  })

  it('skips analyses without rating', () => {
    const game = makeGame()
    game.players.white.rating = undefined
    const analyses = [makeAnalysis({ game, playerColor: 'white' })]
    expect(buildRatingHistory(analyses)).toHaveLength(0)
  })

  it('sorts by timestamp', () => {
    const game1 = makeGame({ createdAt: 2000 })
    const game2 = makeGame({ createdAt: 1000 })
    const analyses: GameAnalysis[] = [
      makeAnalysis({ game: game1, playerColor: 'white' }),
      makeAnalysis({ game: game2, playerColor: 'white' }),
    ]
    const result = buildRatingHistory(analyses)
    expect(result[0]?.timestamp).toBe(1000)
    expect(result[1]?.timestamp).toBe(2000)
  })
})

import type {
  GameAnalysis,
  GameResult,
  OpeningStats,
  OpponentStats,
  RatingPoint,
  SpeedStats,
  WinLossDrawStats,
} from '@/types/analysis'
import type { GameColor, LichessGame } from '@/types/lichess'

export function computeWinLossDraw(
  games: GameAnalysis[],
): WinLossDrawStats {
  const total = games.length
  if (total === 0) {
    return { wins: 0, losses: 0, draws: 0, total: 0, winRate: 0, lossRate: 0, drawRate: 0 }
  }
  const wins = games.filter((g) => g.result === 'win').length
  const losses = games.filter((g) => g.result === 'loss').length
  const draws = games.filter((g) => g.result === 'draw').length
  return {
    wins,
    losses,
    draws,
    total,
    winRate: (wins / total) * 100,
    lossRate: (losses / total) * 100,
    drawRate: (draws / total) * 100,
  }
}

export function getPlayerColor(game: LichessGame, username: string): GameColor | null {
  const lc = username.toLowerCase()
  if (game.players.white.user?.id.toLowerCase() === lc) {
    return 'white'
  }
  if (game.players.black.user?.id.toLowerCase() === lc) {
    return 'black'
  }
  return null
}

export function getGameResult(game: LichessGame, playerColor: GameColor): GameResult {
  if (game.winner === undefined || game.winner === null) {
    return 'draw'
  }
  return game.winner === playerColor ? 'win' : 'loss'
}

export function buildGameAnalyses(games: LichessGame[], username: string): GameAnalysis[] {
  return games.reduce<GameAnalysis[]>((acc, game) => {
    const playerColor = getPlayerColor(game, username)
    if (playerColor === null) {
      return acc
    }
    const opponentColor: GameColor = playerColor === 'white' ? 'black' : 'white'
    const opponent = game.players[opponentColor]
    const opponentName = opponent.user?.name ?? opponent.name ?? 'AI'
    const result = getGameResult(game, playerColor)
    const ratingDiff = game.players[playerColor].ratingDiff

    acc.push({
      game,
      result,
      playerColor,
      opponentName,
      opponentRating: opponent.rating,
      ratingChange: ratingDiff,
    })
    return acc
  }, [])
}

export function computeSpeedStats(analyses: GameAnalysis[]): SpeedStats[] {
  const bySpeed = new Map<string, GameAnalysis[]>()
  for (const analysis of analyses) {
    const speed = analysis.game.speed
    const group = bySpeed.get(speed) ?? []
    group.push(analysis)
    bySpeed.set(speed, group)
  }

  return Array.from(bySpeed.entries()).map(([speed, group]) => {
    const wins = group.filter((g) => g.result === 'win').length
    const losses = group.filter((g) => g.result === 'loss').length
    const draws = group.filter((g) => g.result === 'draw').length
    const total = group.length
    const ratingsWithValues = group
      .map((g) => g.game.players[g.playerColor].rating)
      .filter((r): r is number => r !== undefined)
    const averageRating =
      ratingsWithValues.length > 0
        ? ratingsWithValues.reduce((a, b) => a + b, 0) / ratingsWithValues.length
        : undefined

    return {
      speed: speed as GameAnalysis['game']['speed'],
      games: total,
      wins,
      losses,
      draws,
      winRate: total > 0 ? (wins / total) * 100 : 0,
      averageRating: averageRating !== undefined ? Math.round(averageRating) : undefined,
    }
  })
}

export function computeOpeningStats(analyses: GameAnalysis[], topN = 10): OpeningStats[] {
  const byOpening = new Map<string, { eco: string; name: string; analyses: GameAnalysis[] }>()

  for (const analysis of analyses) {
    const opening = analysis.game.opening
    if (opening === undefined) {
      continue
    }
    const key = opening.eco
    const group = byOpening.get(key)
    if (group !== undefined) {
      group.analyses.push(analysis)
    } else {
      byOpening.set(key, { eco: opening.eco, name: opening.name, analyses: [analysis] })
    }
  }

  return Array.from(byOpening.values())
    .map(({ eco, name, analyses: group }) => {
      const wins = group.filter((g) => g.result === 'win').length
      const losses = group.filter((g) => g.result === 'loss').length
      const draws = group.filter((g) => g.result === 'draw').length
      const total = group.length
      return {
        eco,
        name,
        games: total,
        wins,
        losses,
        draws,
        winRate: total > 0 ? (wins / total) * 100 : 0,
      }
    })
    .sort((a, b) => b.games - a.games)
    .slice(0, topN)
}

export function computeOpponentStats(analyses: GameAnalysis[], topN = 10): OpponentStats[] {
  const byOpponent = new Map<string, GameAnalysis[]>()
  for (const analysis of analyses) {
    const name = analysis.opponentName
    const group = byOpponent.get(name) ?? []
    group.push(analysis)
    byOpponent.set(name, group)
  }

  return Array.from(byOpponent.entries())
    .map(([username, group]) => ({
      username,
      games: group.length,
      wins: group.filter((g) => g.result === 'win').length,
      losses: group.filter((g) => g.result === 'loss').length,
      draws: group.filter((g) => g.result === 'draw').length,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, topN)
}

export function buildRatingHistory(analyses: GameAnalysis[]): RatingPoint[] {
  return analyses
    .filter((a) => a.game.players[a.playerColor].rating !== undefined)
    .map((a) => ({
      timestamp: a.game.createdAt,
      rating: a.game.players[a.playerColor].rating as number,
      gameId: a.game.id,
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
}

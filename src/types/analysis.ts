import type { GameColor, GameResult, GameSpeed, LichessGame, PerfType } from './lichess'

export interface WinLossDrawStats {
  wins: number
  losses: number
  draws: number
  total: number
  winRate: number
  lossRate: number
  drawRate: number
}

export interface OpeningStats {
  eco: string
  name: string
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface SpeedStats {
  speed: GameSpeed
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageRating?: number
}

export interface ColorStats {
  color: GameColor
  games: number
  wins: number
  losses: number
  draws: number
  winRate: number
}

export interface OpponentStats {
  username: string
  games: number
  wins: number
  losses: number
  draws: number
}

export interface RatingPoint {
  timestamp: number
  rating: number
  gameId: string
}

export interface GameAnalysis {
  game: LichessGame
  result: GameResult
  playerColor: GameColor
  opponentName: string
  opponentRating?: number
  ratingChange?: number
}

export interface AnalysisSummary {
  username: string
  totalGames: number
  overall: WinLossDrawStats
  byColor: {
    white: WinLossDrawStats
    black: WinLossDrawStats
  }
  bySpeed: SpeedStats[]
  topOpenings: OpeningStats[]
  topOpponents: OpponentStats[]
  ratingHistory: RatingPoint[]
  perfType: PerfType | null
}

export type SortField = 'games' | 'winRate' | 'wins'
export type SortDirection = 'asc' | 'desc'

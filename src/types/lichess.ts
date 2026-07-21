export interface LichessUser {
  id: string
  username: string
  title?: string
  online?: boolean
  patron?: boolean
  createdAt: number
  seenAt: number
  playTime?: {
    total: number
    tv: number
  }
  url: string
  nbFollowing?: number
  nbFollowers?: number
  completionRate?: number
  count: {
    all: number
    rated: number
    ai: number
    draw: number
    drawH: number
    loss: number
    lossH: number
    win: number
    winH: number
    bookmark: number
    playing: number
    import: number
    me: number
  }
  followable?: boolean
  following?: boolean
  blocking?: boolean
  followsYou?: boolean
  perfs: Record<PerfType, PerfStat>
  profile?: UserProfile
}

export interface UserProfile {
  country?: string
  location?: string
  bio?: string
  firstName?: string
  lastName?: string
  fideRating?: number
  uscfRating?: number
  ecfRating?: number
  links?: string
}

export interface PerfStat {
  games: number
  rating: number
  rd: number
  prog: number
  prov?: boolean
}

export type PerfType =
  | 'ultraBullet'
  | 'bullet'
  | 'blitz'
  | 'rapid'
  | 'classical'
  | 'correspondence'
  | 'chess960'
  | 'crazyhouse'
  | 'antichess'
  | 'atomic'
  | 'horde'
  | 'kingOfTheHill'
  | 'racingKings'
  | 'threeCheck'
  | 'puzzle'

export type GameSpeed = 'ultraBullet' | 'bullet' | 'blitz' | 'rapid' | 'classical' | 'correspondence'

export type GameResult = 'win' | 'loss' | 'draw'

export type GameColor = 'white' | 'black'

export interface LichessGame {
  id: string
  rated: boolean
  variant: string
  speed: GameSpeed
  perf: string
  createdAt: number
  lastMoveAt: number
  status: GameStatus
  players: {
    white: GamePlayer
    black: GamePlayer
  }
  winner?: GameColor
  opening?: {
    eco: string
    name: string
    ply: number
  }
  moves?: string
  pgn?: string
  clock?: {
    initial: number
    increment: number
    totalTime: number
  }
  analysed?: boolean
}

export type GameStatus =
  | 'created'
  | 'started'
  | 'aborted'
  | 'mate'
  | 'resign'
  | 'stalemate'
  | 'timeout'
  | 'draw'
  | 'outoftime'
  | 'cheat'
  | 'noStart'
  | 'unknownFinish'
  | 'variantEnd'

export interface GamePlayer {
  user?: {
    name: string
    id: string
    title?: string
    patron?: boolean
  }
  aiLevel?: number
  rating?: number
  ratingDiff?: number
  name?: string
  provisional?: boolean
  blunder?: number
  inaccuracy?: number
  mistake?: number
  acpl?: number
}

export interface GamesQueryParams {
  since?: number
  until?: number
  max?: number
  rated?: boolean
  perfType?: PerfType
  color?: GameColor
  analysed?: boolean
  moves?: boolean
  pgnInJson?: boolean
  tags?: boolean
  clocks?: boolean
  evals?: boolean
  opening?: boolean
  ongoing?: boolean
  finished?: boolean
}

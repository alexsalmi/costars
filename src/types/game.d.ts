type GameType = 'daily' | 'custom' | 'unlimited'

interface GameEntity {
  id: number,
  type: TmdbType,
  label: string,
  image: string,
  credits?: Array<number>,
  popularity?: number
}

interface DailySolutions {
  score?: number,
  count: number,
  mostPopular: Array<Array<GameEntity>>
}

interface DailyCostars {
  target: GameEntity,
  starter: GameEntity,
  solutions: DailySolutions,
  date?: string,
  day_number?: number,
  id?: number
}

interface DailyStats {
  daysPlayed: number,
  daysOptimal: number,
  currentStreak: number,
  highestStreak: number,
  lastPlayed?: string,
  lastSolve?: Array<GameEntity>,
  lastSolveHints?: Array<Hint>
}

interface Hint {
  id: number,
  type: TmdbType
}
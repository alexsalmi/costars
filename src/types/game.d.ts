type GameType = 'daily' | 'custom' | 'unlimited'

interface GameEntity {
  id: number,
  type: TmdbType,
  label: string,
  image: string,
  credits?: Array<number>
}

interface DailyCostars {
  target: GameEntity,
  starter: GameEntity
}

interface DailyStats {
  daysPlayed: number,
  currentStreak: number,
  highestStreak: number,
  lastPlayed?: string,
  lastSolve?: Array<GameEntity>
}

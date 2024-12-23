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

interface Hint {
  id: number,
  type: TmdbType
}

interface NewDailyCostars extends DailyCostars {
  solutions: Array<Array<GameEntity>>
}
type GameType = 'daily' | 'custom' | 'unlimited'

interface GameEntity {
  id: number,
  type: TmdbType,
  label: string,
  image: string,
  collapsed?: boolean
}
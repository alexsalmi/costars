type SearchType = 'person' | 'movie';

interface GameEntity {
  id: number,
  type: SearchType,
  label: string,
  image: string
}
import type { TitledListValue } from 'sanity'

export type GenreOption = (typeof GENRE_OPTIONS)[number]
export type GenreValue = GenreOption['value']

export const GENRE_OPTIONS: TitledListValue<string>[] = [
  { title: 'Metal', value: 'metal' },
  { title: 'Rock', value: 'rock' },
  { title: 'Pop', value: 'pop' },
  { title: 'Indie', value: 'indie' },
  { title: 'Electrónica', value: 'electronica' },
  { title: 'Urbano', value: 'urbano' },
  { title: 'Otro', value: 'otro' },
]

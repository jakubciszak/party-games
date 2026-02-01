export type GameMode = 'charades' | 'p-game'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Category =
  | 'animals'
  | 'food'
  | 'objects'
  | 'places'
  | 'professions'
  | 'sports'
  | 'emotions'
  | 'actions'
  | 'nature'
  | 'culture'

export const ALL_CATEGORIES: Category[] = [
  'animals',
  'food',
  'objects',
  'places',
  'professions',
  'sports',
  'emotions',
  'actions',
  'nature',
  'culture',
]

export const CATEGORY_LABELS: Record<Category, string> = {
  animals: 'Zwierzęta',
  food: 'Jedzenie',
  objects: 'Przedmioty',
  places: 'Miejsca',
  professions: 'Zawody',
  sports: 'Sport',
  emotions: 'Emocje',
  actions: 'Czynności',
  nature: 'Przyroda',
  culture: 'Kultura',
}

export interface Player {
  id: string
  name: string
  age: number
  score: number
}

export type TimeLimit = 30 | 45 | 60 | 90 | 120 | 'unlimited'

export interface GameSettings {
  mode: GameMode
  players: Player[]
  timeLimit: TimeLimit
  difficulty: Difficulty
  categories: Category[]
  allowWordSkip: boolean
}

export interface GameState {
  currentRound: number
  currentPlayerIndex: number
  currentWord: string
  isWordRevealed: boolean
  timeRemaining: number | null
  isTimerRunning: boolean
  scores: Record<string, number>
}

export interface WordBank {
  easy: string[]
  medium: string[]
  hard: string[]
}

// Poocoo API types
export interface PoocooApiMeta {
  version: string
  language: string
  attribution: string
}

export interface PoocooWordsFilter {
  length?: number
  startsWith?: string
  endsWith?: string
  contains?: string
}

export interface PoocooWordsData {
  filter: PoocooWordsFilter
  words: string[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PoocooWordsResponse {
  success: boolean
  data: PoocooWordsData
  error: string | null
  meta: PoocooApiMeta
}

export interface PoocooWordGroup {
  length: number
  words: string[]
  count: number
}

export interface PoocooWordsFromLettersData {
  letters: string
  wordGroups: PoocooWordGroup[]
  totalCount: number
}

export interface PoocooWordsFromLettersResponse {
  success: boolean
  data: PoocooWordsFromLettersData
  error: string | null
  meta: PoocooApiMeta
}

export interface PoocooWordsFetchOptions {
  length?: number
  startsWith?: string
  endsWith?: string
  contains?: string
  page?: number
  pageSize?: number
}

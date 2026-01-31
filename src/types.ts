export type GameMode = 'charades' | 'p-game'

export type Difficulty = 'easy' | 'medium' | 'hard'

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

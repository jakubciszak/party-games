import { Difficulty, Player } from '../types'

export function calculateDifficulty(players: Player[]): Difficulty {
  if (players.length === 0) {
    return 'medium'
  }

  const youngestAge = Math.min(...players.map(p => p.age))

  if (youngestAge < 12) {
    return 'easy'
  } else if (youngestAge < 18) {
    return 'medium'
  } else {
    return 'hard'
  }
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    easy: 'łatwy',
    medium: 'średni',
    hard: 'trudny',
  }
  return labels[difficulty]
}

export function getYoungestPlayerAge(players: Player[]): number | null {
  if (players.length === 0) return null
  return Math.min(...players.map(p => p.age))
}

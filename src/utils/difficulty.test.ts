import { describe, it, expect } from 'vitest'
import { calculateDifficulty, getDifficultyLabel } from './difficulty'
import { Player } from '../types'

describe('difficulty', () => {
  describe('calculateDifficulty', () => {
    it('should return easy for young players (under 12)', () => {
      const players: Player[] = [
        { id: '1', name: 'Child', age: 8, score: 0 },
        { id: '2', name: 'Parent', age: 35, score: 0 },
      ]
      expect(calculateDifficulty(players)).toBe('easy')
    })

    it('should return easy for youngest player aged 10', () => {
      const players: Player[] = [
        { id: '1', name: 'Tymek', age: 10, score: 0 },
        { id: '2', name: 'Tata', age: 30, score: 0 },
      ]
      expect(calculateDifficulty(players)).toBe('easy')
    })

    it('should return medium for teens (12-17)', () => {
      const players: Player[] = [
        { id: '1', name: 'Teen', age: 14, score: 0 },
        { id: '2', name: 'Parent', age: 40, score: 0 },
      ]
      expect(calculateDifficulty(players)).toBe('medium')
    })

    it('should return hard for adults (18+)', () => {
      const players: Player[] = [
        { id: '1', name: 'Adult1', age: 25, score: 0 },
        { id: '2', name: 'Adult2', age: 30, score: 0 },
      ]
      expect(calculateDifficulty(players)).toBe('hard')
    })

    it('should use the youngest player age to determine difficulty', () => {
      const players: Player[] = [
        { id: '1', name: 'Child', age: 7, score: 0 },
        { id: '2', name: 'Parent', age: 40, score: 0 },
        { id: '3', name: 'Grandparent', age: 65, score: 0 },
      ]
      expect(calculateDifficulty(players)).toBe('easy')
    })

    it('should return medium for empty player list', () => {
      expect(calculateDifficulty([])).toBe('medium')
    })
  })

  describe('getDifficultyLabel', () => {
    it('should return Polish labels', () => {
      expect(getDifficultyLabel('easy')).toBe('łatwy')
      expect(getDifficultyLabel('medium')).toBe('średni')
      expect(getDifficultyLabel('hard')).toBe('trudny')
    })
  })
})

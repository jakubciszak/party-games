import { describe, it, expect } from 'vitest'
import {
  getRandomWord,
  getWordForDifficulty,
  charadesWords,
  pGameWords
} from './wordGenerator'
import { Difficulty, GameMode } from '../types'

describe('wordGenerator', () => {
  describe('word banks', () => {
    it('should have easy, medium and hard words for charades', () => {
      expect(charadesWords.easy.length).toBeGreaterThan(0)
      expect(charadesWords.medium.length).toBeGreaterThan(0)
      expect(charadesWords.hard.length).toBeGreaterThan(0)
    })

    it('should have easy, medium and hard words for p-game', () => {
      expect(pGameWords.easy.length).toBeGreaterThan(0)
      expect(pGameWords.medium.length).toBeGreaterThan(0)
      expect(pGameWords.hard.length).toBeGreaterThan(0)
    })
  })

  describe('getRandomWord', () => {
    it('should return a word from the provided list', () => {
      const words = ['kot', 'pies', 'ryba']
      const result = getRandomWord(words)
      expect(words).toContain(result)
    })

    it('should exclude previously used words', () => {
      const words = ['kot', 'pies', 'ryba']
      const usedWords = ['kot', 'pies']
      const result = getRandomWord(words, usedWords)
      expect(result).toBe('ryba')
    })

    it('should reset when all words have been used', () => {
      const words = ['kot', 'pies']
      const usedWords = ['kot', 'pies']
      const result = getRandomWord(words, usedWords)
      expect(words).toContain(result)
    })
  })

  describe('getWordForDifficulty', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
    const modes: GameMode[] = ['charades', 'p-game']

    difficulties.forEach(difficulty => {
      modes.forEach(mode => {
        it(`should return a word for ${difficulty} difficulty in ${mode} mode`, () => {
          const result = getWordForDifficulty(difficulty, mode)
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        })
      })
    })

    it('should return different words on multiple calls', () => {
      const results = new Set<string>()
      for (let i = 0; i < 10; i++) {
        results.add(getWordForDifficulty('easy', 'charades'))
      }
      // Should have at least some variety (not all the same word)
      expect(results.size).toBeGreaterThan(1)
    })
  })
})

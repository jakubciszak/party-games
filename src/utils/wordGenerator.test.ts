import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getRandomWord,
  getWordForDifficulty,
  getWordForDifficultyAsync,
  resetUsedWords,
  charadesWords,
  pGameWords
} from './wordGenerator'
import { Difficulty, GameMode } from '../types'
import * as poocooApi from '../services/poocooApi'

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

  describe('getWordForDifficultyAsync', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      resetUsedWords()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return word from API when successful', async () => {
      const mockWord = 'słowoZApi'
      vi.spyOn(poocooApi, 'fetchWordForDifficulty').mockResolvedValueOnce(mockWord)

      const result = await getWordForDifficultyAsync('easy', 'charades')

      expect(result).toBe(mockWord)
      expect(poocooApi.fetchWordForDifficulty).toHaveBeenCalledWith('easy', 'charades')
    })

    it('should return word from API for p-game mode', async () => {
      const mockWord = 'piłka'
      vi.spyOn(poocooApi, 'fetchWordForDifficulty').mockResolvedValueOnce(mockWord)

      const result = await getWordForDifficultyAsync('medium', 'p-game')

      expect(result).toBe(mockWord)
      expect(poocooApi.fetchWordForDifficulty).toHaveBeenCalledWith('medium', 'p-game')
    })

    it('should fallback to local words on API error', async () => {
      vi.spyOn(poocooApi, 'fetchWordForDifficulty').mockRejectedValueOnce(
        new poocooApi.PoocooApiError('Network error', 500)
      )
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await getWordForDifficultyAsync('easy', 'charades')

      // Should return a word from local charades easy words
      expect(charadesWords.easy).toContain(result)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Poocoo API error')
      )
    })

    it('should fallback to local words on generic error', async () => {
      vi.spyOn(poocooApi, 'fetchWordForDifficulty').mockRejectedValueOnce(
        new Error('Unknown error')
      )
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await getWordForDifficultyAsync('medium', 'p-game')

      // Should return a word from local charades medium words (p-game uses same words for guessing)
      expect(charadesWords.medium).toContain(result)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to fetch from API'),
        expect.any(Error)
      )
    })

    it('should work for all difficulty levels with API', async () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
      const modes: GameMode[] = ['charades', 'p-game']

      for (const difficulty of difficulties) {
        for (const mode of modes) {
          const mockWord = `${difficulty}-${mode}-word`
          vi.spyOn(poocooApi, 'fetchWordForDifficulty').mockResolvedValueOnce(mockWord)

          const result = await getWordForDifficultyAsync(difficulty, mode)

          expect(result).toBe(mockWord)
        }
      }
    })

    it('should work for all difficulty levels with fallback', async () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
      const modes: GameMode[] = ['charades', 'p-game']
      vi.spyOn(console, 'warn').mockImplementation(() => {})

      for (const difficulty of difficulties) {
        for (const mode of modes) {
          vi.spyOn(poocooApi, 'fetchWordForDifficulty').mockRejectedValueOnce(
            new Error('API unavailable')
          )

          const result = await getWordForDifficultyAsync(difficulty, mode)
          // Both modes use charadesWords for words to guess
          expect(charadesWords[difficulty]).toContain(result)
        }
      }
    })
  })

  describe('resetUsedWords', () => {
    it('should also reset API used words', () => {
      vi.spyOn(poocooApi, 'resetUsedApiWords')

      resetUsedWords()

      expect(poocooApi.resetUsedApiWords).toHaveBeenCalled()
    })
  })
})

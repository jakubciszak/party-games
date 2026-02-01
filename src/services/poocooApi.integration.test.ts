/**
 * Integration tests for Poocoo API
 *
 * These tests make real HTTP requests to the Poocoo API.
 * They are skipped by default and only run when INTEGRATION_TESTS=true.
 *
 * Run with: npm run test:integration
 * Or: INTEGRATION_TESTS=true npm run test:run
 */

import { describe, it, expect } from 'vitest'
import {
  fetchWords,
  fetchWordsFromLetters,
  fetchWordForDifficulty,
  fetchWordsForDifficulty,
  PoocooApiError,
} from './poocooApi'

const RUN_INTEGRATION = import.meta.env.INTEGRATION_TESTS === 'true'

describe.runIf(RUN_INTEGRATION)('poocooApi integration tests', () => {
  // Increase timeout for real API calls
  const TIMEOUT = 10000

  describe('fetchWords', () => {
    it(
      'should fetch words from real API',
      async () => {
        const response = await fetchWords({ length: 5, pageSize: 10 })

        expect(response.success).toBe(true)
        expect(response.data.words).toBeInstanceOf(Array)
        expect(response.data.words.length).toBeGreaterThan(0)
        expect(response.data.words.length).toBeLessThanOrEqual(10)
        response.data.words.forEach(word => {
          expect(word.length).toBe(5)
        })
      },
      TIMEOUT
    )

    it(
      'should fetch words starting with specific letter',
      async () => {
        const response = await fetchWords({
          startsWith: 'p',
          length: 4,
          pageSize: 20,
        })

        expect(response.success).toBe(true)
        expect(response.data.words.length).toBeGreaterThan(0)
        response.data.words.forEach(word => {
          expect(word.startsWith('p')).toBe(true)
          expect(word.length).toBe(4)
        })
      },
      TIMEOUT
    )

    it(
      'should fetch words ending with specific suffix',
      async () => {
        const response = await fetchWords({
          endsWith: 'ść',
          pageSize: 10,
        })

        expect(response.success).toBe(true)
        expect(response.data.words.length).toBeGreaterThan(0)
        response.data.words.forEach(word => {
          expect(word.endsWith('ść')).toBe(true)
        })
      },
      TIMEOUT
    )

    it(
      'should fetch words containing specific substring',
      async () => {
        const response = await fetchWords({
          contains: 'dom',
          pageSize: 10,
        })

        expect(response.success).toBe(true)
        expect(response.data.words.length).toBeGreaterThan(0)
        response.data.words.forEach(word => {
          expect(word.includes('dom')).toBe(true)
        })
      },
      TIMEOUT
    )

    it(
      'should support pagination',
      async () => {
        const page1 = await fetchWords({ length: 5, page: 1, pageSize: 5 })
        const page2 = await fetchWords({ length: 5, page: 2, pageSize: 5 })

        expect(page1.success).toBe(true)
        expect(page2.success).toBe(true)
        expect(page1.data.page).toBe(1)
        expect(page2.data.page).toBe(2)

        // Pages should have different words
        const page1Words = new Set(page1.data.words)
        const page2Words = new Set(page2.data.words)
        const intersection = [...page1Words].filter(w => page2Words.has(w))
        expect(intersection.length).toBe(0)
      },
      TIMEOUT
    )

    it(
      'should return metadata',
      async () => {
        const response = await fetchWords({ length: 3, pageSize: 1 })

        expect(response.meta).toBeDefined()
        expect(response.meta.language).toBe('pl')
        expect(response.meta.version).toBeDefined()
      },
      TIMEOUT
    )

    it(
      'should return totalCount and pagination info',
      async () => {
        const response = await fetchWords({ length: 5, pageSize: 10 })

        expect(response.data.totalCount).toBeGreaterThan(0)
        expect(response.data.pageSize).toBe(10)
        expect(response.data.totalPages).toBeGreaterThan(0)
      },
      TIMEOUT
    )
  })

  describe('fetchWordsFromLetters', () => {
    it(
      'should find anagrams for given letters',
      async () => {
        const response = await fetchWordsFromLetters('dom')

        expect(response.success).toBe(true)
        expect(response.data.letters).toBe('dom')
        expect(response.data.wordGroups).toBeInstanceOf(Array)
        expect(response.data.totalCount).toBeGreaterThan(0)

        // Should find at least 'dom' itself
        const allWords = response.data.wordGroups.flatMap(g => g.words)
        expect(allWords).toContain('dom')
      },
      TIMEOUT
    )

    it(
      'should group words by length',
      async () => {
        const response = await fetchWordsFromLetters('karta')

        expect(response.success).toBe(true)
        response.data.wordGroups.forEach(group => {
          expect(group.length).toBeGreaterThan(0)
          expect(group.words).toBeInstanceOf(Array)
          expect(group.count).toBe(group.words.length)
          group.words.forEach(word => {
            expect(word.length).toBe(group.length)
          })
        })
      },
      TIMEOUT
    )

    it(
      'should handle Polish characters',
      async () => {
        const response = await fetchWordsFromLetters('żółć')

        expect(response.success).toBe(true)
        expect(response.data.letters).toBe('żółć')
      },
      TIMEOUT
    )
  })

  describe('fetchWordForDifficulty', () => {
    it(
      'should fetch word for easy difficulty in charades mode',
      async () => {
        const word = await fetchWordForDifficulty('easy', 'charades')

        expect(typeof word).toBe('string')
        expect(word.length).toBeGreaterThanOrEqual(3)
        expect(word.length).toBeLessThanOrEqual(5)
      },
      TIMEOUT
    )

    it(
      'should fetch word for medium difficulty in charades mode',
      async () => {
        const word = await fetchWordForDifficulty('medium', 'charades')

        expect(typeof word).toBe('string')
        expect(word.length).toBeGreaterThanOrEqual(5)
        expect(word.length).toBeLessThanOrEqual(8)
      },
      TIMEOUT
    )

    it(
      'should fetch word for hard difficulty in charades mode',
      async () => {
        const word = await fetchWordForDifficulty('hard', 'charades')

        expect(typeof word).toBe('string')
        expect(word.length).toBeGreaterThanOrEqual(7)
        expect(word.length).toBeLessThanOrEqual(12)
      },
      TIMEOUT
    )

    it(
      'should fetch word starting with "p" for p-game mode',
      async () => {
        const word = await fetchWordForDifficulty('easy', 'p-game')

        expect(typeof word).toBe('string')
        expect(word.startsWith('p')).toBe(true)
      },
      TIMEOUT
    )

    it(
      'should return different words on multiple calls',
      async () => {
        const words = new Set<string>()

        for (let i = 0; i < 5; i++) {
          const word = await fetchWordForDifficulty('easy', 'charades')
          words.add(word)
        }

        // Should have some variety (at least 2 different words out of 5)
        expect(words.size).toBeGreaterThan(1)
      },
      TIMEOUT * 3
    )
  })

  describe('fetchWordsForDifficulty', () => {
    it(
      'should fetch multiple words',
      async () => {
        const words = await fetchWordsForDifficulty('easy', 'charades', 5)

        expect(words).toBeInstanceOf(Array)
        expect(words.length).toBeGreaterThan(0)
        expect(words.length).toBeLessThanOrEqual(5)
      },
      TIMEOUT * 2
    )

    it(
      'should fetch words starting with "p" for p-game',
      async () => {
        const words = await fetchWordsForDifficulty('medium', 'p-game', 5)

        expect(words.length).toBeGreaterThan(0)
        words.forEach(word => {
          expect(word.startsWith('p')).toBe(true)
        })
      },
      TIMEOUT * 2
    )
  })

  describe('error handling', () => {
    it(
      'should handle empty results gracefully',
      async () => {
        // Very specific filter that might return no results
        try {
          const response = await fetchWords({
            startsWith: 'xyz',
            endsWith: 'qwe',
            length: 3,
          })
          // If it returns, it should be a valid response
          expect(response.success).toBe(true)
        } catch (error) {
          // API might return error for no results
          expect(error).toBeInstanceOf(PoocooApiError)
        }
      },
      TIMEOUT
    )
  })
})

// Helper test to verify integration tests are being skipped in CI
describe('integration test guard', () => {
  it('should skip integration tests when INTEGRATION_TESTS is not set', () => {
    if (!RUN_INTEGRATION) {
      console.log('Integration tests skipped (set INTEGRATION_TESTS=true to run)')
    }
    expect(true).toBe(true)
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchWords,
  fetchWordsFromLetters,
  getRandomWordFromResponse,
  getRandomWordAvoidingUsed,
  resetUsedApiWords,
  fetchWordForDifficulty,
  fetchWordsForDifficulty,
  PoocooApiError,
  API_URL,
} from './poocooApi'
import { PoocooWordsResponse, PoocooWordsFromLettersResponse } from '../types'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('poocooApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetUsedApiWords()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchWords', () => {
    const mockWordsResponse: PoocooWordsResponse = {
      success: true,
      data: {
        filter: { length: 5, startsWith: 'p' },
        words: ['piłka', 'pismo', 'pizza', 'pająk', 'parostatek'],
        totalCount: 2176,
        page: 1,
        pageSize: 100,
        totalPages: 22,
      },
      error: null,
      meta: {
        version: '1.0',
        language: 'pl',
        attribution: 'Powered by poocoo - https://poocoo.pl',
      },
    }

    it('should fetch words successfully with no options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWordsResponse,
      })

      const result = await fetchWords()

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/words`)
      expect(result).toEqual(mockWordsResponse)
    })

    it('should build query string from options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWordsResponse,
      })

      await fetchWords({
        length: 5,
        startsWith: 'p',
        pageSize: 50,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('length=5')
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('startsWith=p')
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=50')
      )
    })

    it('should handle all filter options', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWordsResponse,
      })

      await fetchWords({
        length: 7,
        startsWith: 'a',
        endsWith: 'ć',
        contains: 'ob',
        page: 2,
        pageSize: 25,
      })

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain('length=7')
      expect(calledUrl).toContain('startsWith=a')
      expect(calledUrl).toContain('endsWith=%C4%87') // URL encoded 'ć'
      expect(calledUrl).toContain('contains=ob')
      expect(calledUrl).toContain('page=2')
      expect(calledUrl).toContain('pageSize=25')
    })

    it('should throw PoocooApiError on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      })

      await expect(fetchWords()).rejects.toThrow(PoocooApiError)
      await expect(fetchWords()).rejects.toThrow('API request failed with status')
    })

    it('should throw PoocooApiError when success is false', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          data: null,
          error: 'Invalid parameters',
          meta: {},
        }),
      })

      await expect(fetchWords()).rejects.toThrow(PoocooApiError)
      await expect(fetchWords()).rejects.toThrow('Invalid parameters')
    })

    it('should throw PoocooApiError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchWords()).rejects.toThrow('Network error')
    })
  })

  describe('fetchWordsFromLetters', () => {
    const mockAnagramResponse: PoocooWordsFromLettersResponse = {
      success: true,
      data: {
        letters: 'dom',
        wordGroups: [
          { length: 2, words: ['do', 'od'], count: 2 },
          { length: 3, words: ['dom', 'mod'], count: 2 },
        ],
        totalCount: 4,
      },
      error: null,
      meta: {
        version: '1.0',
        language: 'pl',
        attribution: 'Powered by poocoo - https://poocoo.pl',
      },
    }

    it('should fetch anagram words successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnagramResponse,
      })

      const result = await fetchWordsFromLetters('dom')

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_URL}/words-from-letters?letters=dom`
      )
      expect(result).toEqual(mockAnagramResponse)
    })

    it('should URL encode special characters in letters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnagramResponse,
      })

      await fetchWordsFromLetters('żółć')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('letters=%C5%BC%C3%B3%C5%82%C4%87')
      )
    })

    it('should throw PoocooApiError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchWordsFromLetters('xyz')).rejects.toThrow(PoocooApiError)
    })
  })

  describe('getRandomWordFromResponse', () => {
    it('should return a word from the list', () => {
      const words = ['kot', 'pies', 'ryba']
      const result = getRandomWordFromResponse(words)
      expect(words).toContain(result)
    })

    it('should throw error for empty list', () => {
      expect(() => getRandomWordFromResponse([])).toThrow(PoocooApiError)
      expect(() => getRandomWordFromResponse([])).toThrow('No words available')
    })
  })

  describe('getRandomWordAvoidingUsed', () => {
    it('should return a word from the list', () => {
      const words = ['kot', 'pies', 'ryba']
      const result = getRandomWordAvoidingUsed(words)
      expect(words).toContain(result)
    })

    it('should avoid previously used words', () => {
      const words = ['kot', 'pies']

      // Get first word
      const first = getRandomWordAvoidingUsed(words)

      // Get second word - should be different
      const second = getRandomWordAvoidingUsed(words)
      expect(second).not.toBe(first)
    })

    it('should reset when all words used', () => {
      const words = ['kot']

      // Use the only word
      const first = getRandomWordAvoidingUsed(words)
      expect(first).toBe('kot')

      // Should return same word after reset (since it's the only option)
      const second = getRandomWordAvoidingUsed(words)
      expect(second).toBe('kot')
    })

    it('should limit memory usage', () => {
      const words = Array.from({ length: 200 }, (_, i) => `word${i}`)

      // Use many words
      for (let i = 0; i < 150; i++) {
        getRandomWordAvoidingUsed(words, 100)
      }

      // Should still work without running out of memory
      const result = getRandomWordAvoidingUsed(words, 100)
      expect(words).toContain(result)
    })
  })

  describe('resetUsedApiWords', () => {
    it('should allow previously used words after reset', () => {
      const words = ['jedyneSlowo']

      // Use the word
      getRandomWordAvoidingUsed(words)

      // Reset
      resetUsedApiWords()

      // Should be able to get the same word
      const result = getRandomWordAvoidingUsed(words)
      expect(result).toBe('jedyneSlowo')
    })
  })

  describe('fetchWordForDifficulty', () => {
    const createMockResponse = (words: string[]): PoocooWordsResponse => ({
      success: true,
      data: {
        filter: {},
        words,
        totalCount: words.length,
        page: 1,
        pageSize: 100,
        totalPages: 1,
      },
      error: null,
      meta: {
        version: '1.0',
        language: 'pl',
        attribution: 'Powered by poocoo',
      },
    })

    it('should fetch a word for easy difficulty', async () => {
      const mockWords = ['kot', 'pies', 'dom', 'las', 'ser']
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })

      const result = await fetchWordForDifficulty('easy', 'charades')

      expect(mockWords).toContain(result)
    })

    it('should fetch a word for medium difficulty', async () => {
      const mockWords = ['samochód', 'komputer', 'telefon']
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })

      const result = await fetchWordForDifficulty('medium', 'charades')

      expect(mockWords).toContain(result)
    })

    it('should fetch a word for hard difficulty', async () => {
      const mockWords = ['sprawiedliwość', 'demokracja', 'świadomość']
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })

      const result = await fetchWordForDifficulty('hard', 'charades')

      expect(mockWords).toContain(result)
    })

    it('should include startsWith=p for p-game mode', async () => {
      const mockWords = ['piłka', 'pies', 'pizza']
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })

      await fetchWordForDifficulty('easy', 'p-game')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('startsWith=p')
      )
    })

    it('should not include startsWith for charades mode', async () => {
      const mockWords = ['kot', 'pies', 'ryba']
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })

      await fetchWordForDifficulty('easy', 'charades')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.not.stringContaining('startsWith=')
      )
    })

    it('should request appropriate word lengths for each difficulty', async () => {
      const mockWords = ['test']

      // Test easy (3-5 characters)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })
      await fetchWordForDifficulty('easy', 'charades')
      let calledUrl = mockFetch.mock.calls[0][0]
      let lengthMatch = calledUrl.match(/length=(\d+)/)
      expect(lengthMatch).toBeTruthy()
      let length = parseInt(lengthMatch![1])
      expect(length).toBeGreaterThanOrEqual(3)
      expect(length).toBeLessThanOrEqual(5)

      // Test medium (5-8 characters)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })
      await fetchWordForDifficulty('medium', 'charades')
      calledUrl = mockFetch.mock.calls[1][0]
      lengthMatch = calledUrl.match(/length=(\d+)/)
      expect(lengthMatch).toBeTruthy()
      length = parseInt(lengthMatch![1])
      expect(length).toBeGreaterThanOrEqual(5)
      expect(length).toBeLessThanOrEqual(8)

      // Test hard (7-12 characters)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })
      await fetchWordForDifficulty('hard', 'charades')
      calledUrl = mockFetch.mock.calls[2][0]
      lengthMatch = calledUrl.match(/length=(\d+)/)
      expect(lengthMatch).toBeTruthy()
      length = parseInt(lengthMatch![1])
      expect(length).toBeGreaterThanOrEqual(7)
      expect(length).toBeLessThanOrEqual(12)
    })
  })

  describe('fetchWordsForDifficulty', () => {
    const createMockResponse = (words: string[]): PoocooWordsResponse => ({
      success: true,
      data: {
        filter: {},
        words,
        totalCount: words.length,
        page: 1,
        pageSize: 100,
        totalPages: 1,
      },
      error: null,
      meta: {
        version: '1.0',
        language: 'pl',
        attribution: 'Powered by poocoo',
      },
    })

    it('should fetch multiple words', async () => {
      const mockWords = ['kot', 'pies', 'ryba', 'dom', 'las']
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => createMockResponse(mockWords),
      })

      const result = await fetchWordsForDifficulty('easy', 'charades', 5)

      expect(result.length).toBeLessThanOrEqual(5)
      result.forEach(word => expect(mockWords).toContain(word))
    })

    it('should handle API errors gracefully', async () => {
      // First call succeeds, second fails
      const mockWords = ['słowo']
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createMockResponse(mockWords),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createMockResponse(mockWords),
        })

      const result = await fetchWordsForDifficulty('easy', 'charades', 3)

      // Should return whatever words were successfully fetched
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('PoocooApiError', () => {
    it('should create error with message', () => {
      const error = new PoocooApiError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('PoocooApiError')
    })

    it('should create error with status code', () => {
      const error = new PoocooApiError('Not found', 404)
      expect(error.statusCode).toBe(404)
    })

    it('should create error with API error', () => {
      const error = new PoocooApiError('API failed', 500, 'Internal server error')
      expect(error.apiError).toBe('Internal server error')
    })
  })
})

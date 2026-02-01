import {
  PoocooWordsResponse,
  PoocooWordsFromLettersResponse,
  PoocooWordsFetchOptions,
  Difficulty,
  GameMode,
} from '../types'

const API_BASE_URL = 'https://api.poocoo.pl/api/v1'

export class PoocooApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiError?: string | null
  ) {
    super(message)
    this.name = 'PoocooApiError'
  }
}

/**
 * Builds query string from options object
 */
function buildQueryString(options: PoocooWordsFetchOptions): string {
  const params = new URLSearchParams()

  if (options.length !== undefined) {
    params.append('length', options.length.toString())
  }
  if (options.startsWith) {
    params.append('startsWith', options.startsWith)
  }
  if (options.endsWith) {
    params.append('endsWith', options.endsWith)
  }
  if (options.contains) {
    params.append('contains', options.contains)
  }
  if (options.page !== undefined) {
    params.append('page', options.page.toString())
  }
  if (options.pageSize !== undefined) {
    params.append('pageSize', options.pageSize.toString())
  }

  return params.toString()
}

/**
 * Fetches words from Poocoo API with optional filters
 */
export async function fetchWords(
  options: PoocooWordsFetchOptions = {}
): Promise<PoocooWordsResponse> {
  const queryString = buildQueryString(options)
  const url = `${API_BASE_URL}/words${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new PoocooApiError(
      `API request failed with status ${response.status}`,
      response.status
    )
  }

  const data: PoocooWordsResponse = await response.json()

  if (!data.success) {
    throw new PoocooApiError(
      data.error || 'Unknown API error',
      undefined,
      data.error
    )
  }

  return data
}

/**
 * Fetches words that can be formed from given letters (anagram solver)
 */
export async function fetchWordsFromLetters(
  letters: string
): Promise<PoocooWordsFromLettersResponse> {
  const url = `${API_BASE_URL}/words-from-letters?letters=${encodeURIComponent(letters)}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new PoocooApiError(
      `API request failed with status ${response.status}`,
      response.status
    )
  }

  const data: PoocooWordsFromLettersResponse = await response.json()

  if (!data.success) {
    throw new PoocooApiError(
      data.error || 'Unknown API error',
      undefined,
      data.error
    )
  }

  return data
}

/**
 * Gets a random word from API response
 */
export function getRandomWordFromResponse(words: string[]): string {
  if (words.length === 0) {
    throw new PoocooApiError('No words available')
  }
  return words[Math.floor(Math.random() * words.length)]
}

// Track used words to avoid repetition within a session
const usedApiWords: Set<string> = new Set()

/**
 * Gets a random word from API, avoiding recently used words
 */
export function getRandomWordAvoidingUsed(
  words: string[],
  maxUsedWords: number = 100
): string {
  const availableWords = words.filter(word => !usedApiWords.has(word))

  // If all words used, reset the tracking
  if (availableWords.length === 0) {
    usedApiWords.clear()
    return getRandomWordFromResponse(words)
  }

  const word = getRandomWordFromResponse(availableWords)
  usedApiWords.add(word)

  // Limit memory usage by clearing if too many words tracked
  if (usedApiWords.size > maxUsedWords) {
    const wordsArray = Array.from(usedApiWords)
    usedApiWords.clear()
    // Keep the most recent half
    wordsArray.slice(-Math.floor(maxUsedWords / 2)).forEach(w => usedApiWords.add(w))
  }

  return word
}

/**
 * Resets the used words tracking
 */
export function resetUsedApiWords(): void {
  usedApiWords.clear()
}

/**
 * Configuration for word fetching based on difficulty and game mode
 */
interface WordFetchConfig {
  minLength: number
  maxLength: number
  startsWith?: string
}

const difficultyConfig: Record<Difficulty, WordFetchConfig> = {
  easy: { minLength: 3, maxLength: 5 },
  medium: { minLength: 5, maxLength: 8 },
  hard: { minLength: 7, maxLength: 12 },
}

/**
 * Fetches a random word for the given difficulty level
 * For 'p-game' mode, words start with 'p'
 */
export async function fetchWordForDifficulty(
  difficulty: Difficulty,
  mode: GameMode
): Promise<string> {
  const config = difficultyConfig[difficulty]

  // For p-game, words must start with 'p'
  const startsWith = mode === 'p-game' ? 'p' : undefined

  // Fetch words of varying lengths within the difficulty range
  const targetLength = Math.floor(
    Math.random() * (config.maxLength - config.minLength + 1) + config.minLength
  )

  const response = await fetchWords({
    length: targetLength,
    startsWith,
    pageSize: 100,
  })

  return getRandomWordAvoidingUsed(response.data.words)
}

/**
 * Fetches multiple random words for the given difficulty level
 */
export async function fetchWordsForDifficulty(
  difficulty: Difficulty,
  mode: GameMode,
  count: number = 10
): Promise<string[]> {
  const config = difficultyConfig[difficulty]
  const startsWith = mode === 'p-game' ? 'p' : undefined

  const words: string[] = []
  const lengths = new Set<number>()

  // Generate varied lengths
  while (lengths.size < Math.min(count, config.maxLength - config.minLength + 1)) {
    lengths.add(
      Math.floor(Math.random() * (config.maxLength - config.minLength + 1) + config.minLength)
    )
  }

  // Fetch words for each length
  for (const length of lengths) {
    try {
      const response = await fetchWords({
        length,
        startsWith,
        pageSize: Math.ceil(count / lengths.size) * 2,
      })

      // Add unique words
      for (const word of response.data.words) {
        if (!words.includes(word)) {
          words.push(word)
          if (words.length >= count) break
        }
      }
    } catch {
      // Continue with other lengths if one fails
      continue
    }

    if (words.length >= count) break
  }

  return words.slice(0, count)
}

// Export the API base URL for testing purposes
export const API_URL = API_BASE_URL

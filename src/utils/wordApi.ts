import { Difficulty, GameMode } from '../types'

const API_BASE_URL = 'https://api.poocoo.pl/api/v1'

interface WordsApiResponse {
  success: boolean
  data: {
    words: string[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
  }
  error: string | null
}

// Cache dla pobranych słów
interface WordCache {
  charades: {
    easy: string[]
    medium: string[]
    hard: string[]
  }
  'p-game': {
    easy: string[]
    medium: string[]
    hard: string[]
  }
}

const wordCache: WordCache = {
  charades: { easy: [], medium: [], hard: [] },
  'p-game': { easy: [], medium: [], hard: [] },
}

// Tracking użytych słów z API
const usedApiWords: {
  charades: string[]
  'p-game': string[]
} = {
  charades: [],
  'p-game': [],
}

// Konfiguracja trudności - długość słów dla kalamburów
const difficultyLengthConfig: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 3, max: 5 },
  medium: { min: 5, max: 8 },
  hard: { min: 7, max: 12 },
}

// Pobierz losową stronę z dostępnych
function getRandomPage(totalPages: number): number {
  return Math.floor(Math.random() * totalPages) + 1
}

// Pobierz słowa z API dla kalamburów (różne długości)
async function fetchCharadesWords(difficulty: Difficulty): Promise<string[]> {
  const { min, max } = difficultyLengthConfig[difficulty]
  const words: string[] = []

  // Pobierz słowa dla kilku różnych długości
  const lengths = []
  for (let len = min; len <= max; len++) {
    lengths.push(len)
  }

  // Losowo wybierz 2-3 długości do pobrania
  const shuffledLengths = lengths.sort(() => Math.random() - 0.5).slice(0, 3)

  for (const length of shuffledLengths) {
    try {
      // Najpierw sprawdź ile jest stron
      const countResponse = await fetch(
        `${API_BASE_URL}/words?length=${length}&pageSize=1`
      )
      if (!countResponse.ok) continue

      const countData: WordsApiResponse = await countResponse.json()
      if (!countData.success || countData.data.totalPages === 0) continue

      // Pobierz losową stronę
      const randomPage = getRandomPage(Math.min(countData.data.totalPages, 50))
      const response = await fetch(
        `${API_BASE_URL}/words?length=${length}&page=${randomPage}&pageSize=50`
      )

      if (!response.ok) continue

      const data: WordsApiResponse = await response.json()
      if (data.success && data.data.words) {
        words.push(...data.data.words)
      }
    } catch (error) {
      console.warn(`Błąd pobierania słów o długości ${length}:`, error)
    }
  }

  return words
}

// Pobierz słowa z API dla Gry na P (słowa zaczynające się na P)
async function fetchPGameWords(difficulty: Difficulty): Promise<string[]> {
  const { min, max } = difficultyLengthConfig[difficulty]
  const words: string[] = []

  // Pobierz słowa na P dla różnych długości
  for (let length = min; length <= max; length++) {
    try {
      // Sprawdź ile jest stron
      const countResponse = await fetch(
        `${API_BASE_URL}/words?startsWith=p&length=${length}&pageSize=1`
      )
      if (!countResponse.ok) continue

      const countData: WordsApiResponse = await countResponse.json()
      if (!countData.success || countData.data.totalPages === 0) continue

      // Pobierz losową stronę
      const randomPage = getRandomPage(Math.min(countData.data.totalPages, 20))
      const response = await fetch(
        `${API_BASE_URL}/words?startsWith=p&length=${length}&page=${randomPage}&pageSize=30`
      )

      if (!response.ok) continue

      const data: WordsApiResponse = await response.json()
      if (data.success && data.data.words) {
        words.push(...data.data.words)
      }
    } catch (error) {
      console.warn(`Błąd pobierania słów na P o długości ${length}:`, error)
    }
  }

  return words
}

// Główna funkcja do pobrania słów z cache lub API
export async function fetchWordsFromApi(
  difficulty: Difficulty,
  mode: GameMode
): Promise<string[]> {
  const cache = wordCache[mode][difficulty]

  // Jeśli cache jest pusty lub prawie pusty, pobierz nowe słowa
  if (cache.length < 10) {
    try {
      const newWords =
        mode === 'charades'
          ? await fetchCharadesWords(difficulty)
          : await fetchPGameWords(difficulty)

      if (newWords.length > 0) {
        wordCache[mode][difficulty] = [...cache, ...newWords]
      }
    } catch (error) {
      console.warn('Błąd pobierania słów z API:', error)
    }
  }

  return wordCache[mode][difficulty]
}

// Pobierz losowe słowo z API (z cachowaniem)
export async function getRandomWordFromApi(
  difficulty: Difficulty,
  mode: GameMode
): Promise<string | null> {
  const words = await fetchWordsFromApi(difficulty, mode)
  const usedWords = usedApiWords[mode]

  // Filtruj użyte słowa
  const availableWords = words.filter((word) => !usedWords.includes(word))

  if (availableWords.length === 0) {
    // Reset użytych słów jeśli wszystkie zostały użyte
    usedApiWords[mode] = []
    // Wyczyść cache żeby pobrać nowe słowa
    wordCache[mode][difficulty] = []
    return null
  }

  // Wybierz losowe słowo
  const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)]
  usedApiWords[mode].push(randomWord)

  // Usuń słowo z cache
  const index = wordCache[mode][difficulty].indexOf(randomWord)
  if (index > -1) {
    wordCache[mode][difficulty].splice(index, 1)
  }

  return randomWord
}

// Prefetch słów przy starcie gry
export async function prefetchWords(mode: GameMode): Promise<void> {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

  await Promise.all(
    difficulties.map((difficulty) => fetchWordsFromApi(difficulty, mode))
  )
}

// Reset cache i użytych słów
export function resetApiWordCache(): void {
  wordCache.charades = { easy: [], medium: [], hard: [] }
  wordCache['p-game'] = { easy: [], medium: [], hard: [] }
  usedApiWords.charades = []
  usedApiWords['p-game'] = []
}

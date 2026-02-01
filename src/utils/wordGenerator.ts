import { Difficulty, GameMode, Category, ALL_CATEGORIES } from '../types'
import { fetchWordForDifficulty, resetUsedApiWords, PoocooApiError } from '../services/poocooApi'

// Struktura słów z podziałem na kategorie i poziomy trudności
export interface CategoryWords {
  easy: string[]
  medium: string[]
  hard: string[]
}

export type WordsByCategory = Record<Category, CategoryWords>

export const charadesWordsByCategory: WordsByCategory = {
  animals: {
    easy: ['kot', 'pies', 'ryba', 'ptak', 'koń', 'krowa', 'świnia', 'kura', 'kaczka', 'królik', 'mysz', 'słoń', 'żyrafa', 'lew', 'małpa', 'niedźwiedź', 'wilk', 'lis', 'jeleń', 'motyl'],
    medium: ['pingwin', 'krokodyl', 'kangur', 'papuga', 'wąż', 'rekin', 'delfin', 'wieloryb', 'tygrys', 'zebra', 'goryl', 'panda', 'koala', 'wielbłąd', 'nosorożec'],
    hard: ['kameleon', 'ośmiornica', 'meduza', 'koliber', 'mrówkojad', 'leniwiec', 'pancernik', 'szympans', 'orangutan', 'lampart'],
  },
  food: {
    easy: ['jabłko', 'banan', 'pizza', 'lody', 'ciasto', 'chleb', 'mleko', 'jajko', 'ser', 'pomidor', 'marchewka', 'ziemniak'],
    medium: ['spaghetti', 'hamburger', 'sushi', 'pierogi', 'naleśniki', 'kanapka', 'zupa', 'sałatka', 'frytki', 'omlet'],
    hard: ['tiramisu', 'ratatouille', 'paella', 'gazpacho', 'falafel', 'curry', 'dim sum', 'risotto'],
  },
  objects: {
    easy: ['piłka', 'lalka', 'samochód', 'telefon', 'telewizor', 'krzesło', 'stół', 'łóżko', 'parasol', 'kapelusz', 'buty', 'okulary', 'zegarek', 'torba', 'klucz'],
    medium: ['helikopter', 'łódź podwodna', 'mikroskop', 'teleskop', 'wentylator', 'odkurzacz', 'pralka', 'lodówka', 'mikser', 'laptop'],
    hard: ['stetoskop', 'defibrylator', 'oscyloskop', 'astrolabium', 'saksofon', 'akordeon', 'kontrabas'],
  },
  places: {
    easy: ['dom', 'szkoła', 'sklep', 'park', 'plaża', 'las', 'góry', 'zoo', 'kino', 'basen'],
    medium: ['restauracja', 'teatr', 'muzeum', 'biblioteka', 'szpital', 'lotnisko', 'dworzec', 'stadion', 'siłownia', 'aquapark'],
    hard: ['obserwatorium', 'planetarium', 'amfiteatr', 'katedra', 'klasztor', 'latarnia morska', 'wieża Eiffla'],
  },
  professions: {
    easy: ['lekarz', 'strażak', 'policjant', 'nauczyciel', 'kucharz', 'kierowca', 'fryzjer', 'ogrodnik'],
    medium: ['pilot', 'astronauta', 'detektyw', 'magik', 'aktor', 'muzyk', 'fotograf', 'dentysta', 'weterynarz', 'architekt'],
    hard: ['chirurg', 'archeolog', 'paleontolog', 'meteorolog', 'kaskader', 'dyrygent', 'choreograf', 'spiker'],
  },
  sports: {
    easy: ['piłka nożna', 'pływanie', 'bieganie', 'skakanie', 'tańczenie'],
    medium: ['koszykówka', 'siatkówka', 'tenis', 'golf', 'hokej', 'łyżwiarstwo', 'narciarstwo', 'surfing', 'judo', 'boks'],
    hard: ['szermierka', 'polo', 'curling', 'biathlon', 'bobslej', 'skeleton', 'parkour', 'triathlon'],
  },
  emotions: {
    easy: ['śmiać się', 'płakać', 'złościć się', 'bać się', 'cieszyć się'],
    medium: ['zmęczony', 'podekscytowany', 'zaskoczony', 'znudzony', 'przestraszony', 'dumny', 'zawstydzony', 'zdenerwowany'],
    hard: ['nostalgia', 'melancholia', 'euforia', 'frustracja', 'ekscytacja', 'desperacja', 'kontemplacja'],
  },
  actions: {
    easy: ['spać', 'jeść', 'pić', 'biegać', 'skakać', 'myć zęby', 'czesać włosy', 'malować', 'rysować', 'czytać', 'pisać'],
    medium: ['grać w piłkę', 'jeździć na rowerze', 'wspinać się', 'gotować obiad', 'robić zdjęcie', 'prowadzić samochód', 'grać na gitarze', 'robić zakupy'],
    hard: ['negocjować kontrakt', 'prowadzić wywiad', 'składać origami', 'żonglować', 'hipnotyzować', 'medytować', 'surfować po internecie'],
  },
  nature: {
    easy: ['słońce', 'księżyc', 'gwiazdy', 'drzewo', 'kwiat', 'trawa', 'deszcz', 'śnieg'],
    medium: ['wulkan', 'tornado', 'tęcza', 'wodospad', 'jaskinia', 'pustynia', 'dżungla', 'góra lodowa'],
    hard: ['zorza polarna', 'zaćmienie', 'trzęsienie ziemi', 'tsunami', 'lawina', 'gejzer', 'delta rzeki'],
  },
  culture: {
    easy: ['książka', 'film', 'piosenka', 'obraz', 'rzeźba'],
    medium: ['Harry Potter', 'Gwiezdne Wojny', 'Król Lew', 'Shrek', 'Batman', 'Superman', 'Spider-Man'],
    hard: ['Władca Pierścieni', 'Matrix', 'Avatar', 'Titanic', 'Mona Lisa', 'Romeo i Julia', 'Hamlet'],
  },
}

export const pGameWordsByCategory: WordsByCategory = {
  animals: {
    easy: ['pies', 'ptak', 'pszczoła', 'paw', 'papuga', 'pingwin', 'panda'],
    medium: ['pantera', 'pelikan', 'piton', 'pirania', 'ptasznik', 'puma'],
    hard: ['pazurnik', 'pasożyt', 'pstrąg', 'perkoz', 'pluszcz'],
  },
  food: {
    easy: ['pizza', 'pomidor', 'pieróg', 'pączek', 'pomarańcza', 'papryka'],
    medium: ['pasztet', 'piernik', 'placek', 'pstrąg', 'pieczeń', 'polewka'],
    hard: ['profiterole', 'panna cotta', 'prosciutto', 'polędwica', 'pistacje'],
  },
  objects: {
    easy: ['piłka', 'parasol', 'poduszka', 'plecak', 'piórko', 'pędzel'],
    medium: ['pralka', 'projektor', 'patelnia', 'portfel', 'przecinak', 'pozytywka'],
    hard: ['perforacja', 'pryzmat', 'pendrive', 'paralaksa', 'perystaltyka'],
  },
  places: {
    easy: ['park', 'plaża', 'poczta', 'piekarnia', 'parking'],
    medium: ['pensjonat', 'port', 'posterunek', 'planetarium', 'pawilon'],
    hard: ['panteon', 'pergola', 'pasaż', 'patio', 'promenada'],
  },
  professions: {
    easy: ['policjant', 'pilot', 'piekarz', 'piosenkarz'],
    medium: ['programista', 'prawnik', 'psycholog', 'położna', 'patomorfolog'],
    hard: ['paleontolog', 'psychiatra', 'proktolog', 'periodontolog'],
  },
  sports: {
    easy: ['piłka nożna', 'pływanie', 'ping-pong'],
    medium: ['polo', 'parkour', 'paintball', 'piłka ręczna', 'podnoszenie ciężarów'],
    hard: ['petanque', 'pięciobój', 'parasailing', 'paralotniarstwo'],
  },
  emotions: {
    easy: ['płakać', 'przytulać', 'podziwiać'],
    medium: ['przerażenie', 'podekscytowanie', 'pewność', 'podziw', 'pretensja'],
    hard: ['próżność', 'pycha', 'pokora', 'pogarda', 'patriotyzm'],
  },
  actions: {
    easy: ['pisać', 'pić', 'prać', 'prasować', 'pukać'],
    medium: ['przepisywać', 'przekładać', 'przebierać', 'przecinać', 'przestawiać'],
    hard: ['programować', 'projektować', 'prezentować', 'przeprowadzać', 'przemieszczać'],
  },
  nature: {
    easy: ['plaża', 'pole', 'puszcza', 'potok'],
    medium: ['polana', 'pustynia', 'przepaść', 'pogoda', 'powódź'],
    hard: ['permafrost', 'pradolina', 'półwysep', 'przełęcz', 'przesmyk'],
  },
  culture: {
    easy: ['piosenka', 'plakat', 'pocztówka'],
    medium: ['Pinokio', 'Piotruś Pan', 'Piękna i Bestia', 'Pocahontas'],
    hard: ['Paragraf 22', 'Pianista', 'Prestiż', 'Pulp Fiction'],
  },
}

// Funkcja do pobierania słów z wybranych kategorii i poziomu trudności
// W "Grze na P" hasła do odgadnięcia są normalne - tylko podpowiedzi muszą być na "P"
export function getWordsFromCategories(
  _mode: GameMode,
  difficulty: Difficulty,
  categories: Category[]
): string[] {
  // Zawsze używamy normalnych słów - w "Grze na P" ograniczenie dotyczy podpowiedzi, nie haseł
  const wordsByCategory = charadesWordsByCategory
  const selectedCategories = categories.length > 0 ? categories : ALL_CATEGORIES

  const allWords: string[] = []
  for (const category of selectedCategories) {
    const categoryWords = wordsByCategory[category]
    if (categoryWords) {
      allWords.push(...categoryWords[difficulty])
    }
  }

  return allWords
}

// Śledzenie użytych słów
let usedCharadesWords: string[] = []
let usedPGameWords: string[] = []

export function getRandomWord(words: string[], usedWords: string[] = []): string {
  const availableWords = words.filter(word => !usedWords.includes(word))

  if (availableWords.length === 0) {
    // Reset - wszystkie słowa zostały użyte
    return words[Math.floor(Math.random() * words.length)]
  }

  return availableWords[Math.floor(Math.random() * availableWords.length)]
}

export function getWordForDifficulty(
  difficulty: Difficulty,
  mode: GameMode,
  categories: Category[] = ALL_CATEGORIES
): string {
  const usedWords = mode === 'charades' ? usedCharadesWords : usedPGameWords
  const words = getWordsFromCategories(mode, difficulty, categories)
  const word = getRandomWord(words, usedWords)

  // Zapisz użyte słowo
  if (mode === 'charades') {
    usedCharadesWords.push(word)
    if (usedCharadesWords.length >= words.length) {
      usedCharadesWords = []
    }
  } else {
    usedPGameWords.push(word)
    if (usedPGameWords.length >= words.length) {
      usedPGameWords = []
    }
  }

  return word
}

export function resetUsedWords(): void {
  usedCharadesWords = []
  usedPGameWords = []
  resetUsedApiWords()
}

/**
 * Fetches a word from Poocoo API with fallback to local words
 * This is the async version that tries API first, then falls back to local data
 */
export async function getWordForDifficultyAsync(
  difficulty: Difficulty,
  mode: GameMode,
  categories: Category[] = ALL_CATEGORIES
): Promise<string> {
  // Jeśli wybrane są konkretne kategorie, używaj lokalnych słów
  // API Poocoo nie obsługuje kategorii
  if (categories.length > 0 && categories.length < ALL_CATEGORIES.length) {
    return getWordForDifficulty(difficulty, mode, categories)
  }

  try {
    const word = await fetchWordForDifficulty(difficulty, mode)
    return word
  } catch (error) {
    // Log error for debugging but fall back silently to local words
    if (error instanceof PoocooApiError) {
      console.warn(`Poocoo API error: ${error.message}, using local words`)
    } else {
      console.warn('Failed to fetch from API, using local words:', error)
    }
    return getWordForDifficulty(difficulty, mode, categories)
  }
}

// Eksportuj stare struktury dla kompatybilności wstecznej
export const charadesWords = {
  easy: Object.values(charadesWordsByCategory).flatMap(c => c.easy),
  medium: Object.values(charadesWordsByCategory).flatMap(c => c.medium),
  hard: Object.values(charadesWordsByCategory).flatMap(c => c.hard),
}

export const pGameWords = {
  easy: Object.values(pGameWordsByCategory).flatMap(c => c.easy),
  medium: Object.values(pGameWordsByCategory).flatMap(c => c.medium),
  hard: Object.values(pGameWordsByCategory).flatMap(c => c.hard),
}

import { Difficulty, GameMode, WordBank } from '../types'
import { fetchWordForDifficulty, resetUsedApiWords, PoocooApiError } from '../services/poocooApi'

export const charadesWords: WordBank = {
  easy: [
    // Zwierzęta
    'kot', 'pies', 'ryba', 'ptak', 'koń', 'krowa', 'świnia', 'kura', 'kaczka', 'królik',
    'mysz', 'słoń', 'żyrafa', 'lew', 'małpa', 'niedźwiedź', 'wilk', 'lis', 'jeleń', 'motyl',
    // Czynności proste
    'spać', 'jeść', 'pić', 'biegać', 'skakać', 'tańczyć', 'śpiewać', 'płakać', 'śmiać się',
    'myć zęby', 'czesać włosy', 'malować', 'rysować', 'czytać', 'pisać',
    // Przedmioty codzienne
    'piłka', 'lalka', 'samochód', 'telefon', 'telewizor', 'krzesło', 'stół', 'łóżko',
    'parasol', 'kapelusz', 'buty', 'okulary', 'zegarek', 'torba', 'klucz',
    // Zawody proste
    'lekarz', 'strażak', 'policjant', 'nauczyciel', 'kucharz', 'kierowca',
    // Jedzenie
    'jabłko', 'banan', 'pizza', 'lody', 'ciasto', 'chleb', 'mleko', 'jajko',
  ],
  medium: [
    // Czynności złożone
    'grać w piłkę', 'jeździć na rowerze', 'pływać', 'wspinać się', 'gotować obiad',
    'robić zdjęcie', 'prowadzić samochód', 'grać na gitarze', 'grać na pianinie',
    'robić zakupy', 'sprzątać pokój', 'prasować ubrania', 'kosić trawę',
    // Zawody
    'pilot', 'astronauta', 'detektyw', 'magik', 'clown', 'aktor', 'muzyk',
    'fotograf', 'fryzjer', 'dentysta', 'weterynarz', 'architekt',
    // Sporty
    'koszykówka', 'siatkówka', 'tenis', 'golf', 'hokej', 'łyżwiarstwo', 'narciarstwo',
    'surfing', 'judo', 'boks', 'szermierka',
    // Emocje i stany
    'zmęczony', 'podekscytowany', 'zaskoczony', 'znudzony', 'przestraszony', 'dumny',
    // Rzeczy
    'helikopter', 'łódź podwodna', 'wulkan', 'tornado', 'tęcza', 'księżyc',
    'robot', 'dinozaur', 'rycerz', 'pirat', 'ninja', 'superbohater',
  ],
  hard: [
    // Pojęcia abstrakcyjne
    'wolność', 'sprawiedliwość', 'demokracja', 'ironia', 'karma', 'nostalgia',
    // Idiomy i powiedzenia
    'bujać w obłokach', 'wziąć nogi za pas', 'mieć muchy w nosie', 'siedzieć jak na szpilkach',
    'kręcić nosem', 'złapać byka za rogi', 'wywołać wilka z lasu',
    // Filmy i książki
    'Harry Potter', 'Gwiezdne Wojny', 'Władca Pierścieni', 'Titanic', 'Matrix',
    'Król Lew', 'Shrek', 'Avatar',
    // Zawody specjalistyczne
    'chirurg', 'archeolog', 'paleontolog', 'meteorolog', 'kaskader', 'dyrygent',
    // Złożone czynności
    'negocjować kontrakt', 'prowadzić wywiad', 'składać origami', 'żonglować',
    'hipnotyzować', 'medytować', 'surfować po internecie',
    // Historyczne
    'gladiator', 'faraon', 'wiking', 'samuraj', 'muszkieter',
  ],
}

export const pGameWords: WordBank = {
  easy: [
    // Rodzina
    'mama', 'tata', 'babcia', 'dziadek', 'siostra', 'brat', 'ciocia', 'wujek',
    // Zwierzęta
    'pies', 'kot', 'koń', 'krowa', 'kura', 'kaczka', 'ryba', 'ptak', 'mysz', 'żaba',
    'słoń', 'lew', 'małpa', 'niedźwiedź', 'królik', 'jeż', 'motyl', 'pszczoła',
    // Jedzenie
    'jabłko', 'banan', 'truskawka', 'mleko', 'chleb', 'ser', 'jajko', 'masło',
    'ciasto', 'lody', 'pizza', 'zupa', 'kanapka', 'sok', 'woda',
    // Przedmioty
    'piłka', 'lalka', 'klocki', 'kredki', 'książka', 'plecak', 'buty', 'czapka',
    'rękawiczki', 'parasol', 'krzesło', 'stół', 'łóżko', 'lampa', 'okno', 'drzwi',
    // Miejsca
    'dom', 'szkoła', 'sklep', 'park', 'plaża', 'las', 'góry', 'zoo',
    // Pojazdy
    'samochód', 'autobus', 'rower', 'pociąg', 'samolot', 'statek', 'helikopter',
  ],
  medium: [
    // Zawody
    'lekarz', 'nauczyciel', 'strażak', 'policjant', 'kucharz', 'aktor', 'piosenkarz',
    'malarz', 'sportowiec', 'kierowca', 'fryzjer', 'ogrodnik', 'mechanik',
    // Sporty
    'piłka nożna', 'koszykówka', 'siatkówka', 'tenis', 'pływanie', 'bieganie',
    'jazda na rowerze', 'narty', 'łyżwy', 'taniec',
    // Przedmioty
    'komputer', 'telefon', 'telewizor', 'lodówka', 'pralka', 'mikser', 'odkurzacz',
    'aparat fotograficzny', 'słuchawki', 'zegarek', 'okulary', 'portfel',
    // Miejsca
    'restauracja', 'kino', 'teatr', 'muzeum', 'biblioteka', 'szpital', 'lotnisko',
    'dworzec', 'stadion', 'basen', 'siłownia',
    // Emocje
    'radość', 'smutek', 'strach', 'złość', 'zaskoczenie', 'zmęczenie',
    // Pogoda
    'słońce', 'deszcz', 'śnieg', 'wiatr', 'burza', 'tęcza', 'chmura', 'mgła',
    // Przyroda
    'kwiat', 'drzewo', 'trawa', 'rzeka', 'jezioro', 'morze', 'góra', 'dolina',
  ],
  hard: [
    // Pojęcia abstrakcyjne
    'przyjaźń', 'miłość', 'szczęście', 'mądrość', 'odwaga', 'cierpliwość',
    'sprawiedliwość', 'wolność', 'sukces', 'porażka', 'nadzieja', 'wiara',
    // Nauka
    'grawitacja', 'elektryczność', 'magnetyzm', 'ewolucja', 'fotosynteza',
    'atmosfera', 'klimat', 'ekosystem', 'galaktyka', 'wszechświat',
    // Zawody specjalistyczne
    'archeolog', 'astronom', 'biolog', 'chemik', 'fizyk', 'matematyk',
    'programista', 'architekt', 'prawnik', 'dziennikarz', 'tłumacz',
    // Instrumenty
    'fortepian', 'skrzypce', 'gitara', 'trąbka', 'saksofon', 'perkusja', 'flet',
    // Historia i kultura
    'rycerz', 'zamek', 'piramida', 'faraon', 'cesarz', 'rewolucja', 'demokracja',
    // Technologia
    'internet', 'satelita', 'robot', 'sztuczna inteligencja', 'wirtualna rzeczywistość',
    // Zjawiska
    'zaćmienie', 'zorza polarna', 'trzęsienie ziemi', 'tsunami', 'wulkan',
    // Filozofia
    'etyka', 'logika', 'filozofia', 'świadomość', 'wyobraźnia', 'kreatywność',
  ],
}

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

export function getWordForDifficulty(difficulty: Difficulty, mode: GameMode): string {
  const wordBank = mode === 'charades' ? charadesWords : pGameWords
  const usedWords = mode === 'charades' ? usedCharadesWords : usedPGameWords

  const words = wordBank[difficulty]
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
  mode: GameMode
): Promise<string> {
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
    return getWordForDifficulty(difficulty, mode)
  }
}

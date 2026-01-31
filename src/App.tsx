import { useState } from 'react'
import { GameMode, GameSettings, Player, TimeLimit } from './types'
import { MainMenu } from './components/MainMenu'
import { GameSetup } from './components/GameSetup'
import { GamePlay } from './components/GamePlay'
import { GameResults } from './components/GameResults'
import { calculateDifficulty } from './utils/difficulty'
import './App.css'

type Screen = 'menu' | 'setup' | 'play' | 'results'

interface ResultsData {
  word: string
  wasGuessed: boolean
  scores: Record<string, number>
}

function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '', age: 18, score: 0 },
    { id: '2', name: '', age: 18, score: 0 },
  ])
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(60)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [resultsData, setResultsData] = useState<ResultsData | null>(null)

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode)
    setScreen('setup')
  }

  const handleBackToMenu = () => {
    setScreen('menu')
    setGameMode(null)
    setPlayers([
      { id: '1', name: '', age: 18, score: 0 },
      { id: '2', name: '', age: 18, score: 0 },
    ])
    setTimeLimit(60)
    setCurrentRound(1)
    setCurrentPlayerIndex(0)
    setResultsData(null)
  }

  const handleStartGame = () => {
    setCurrentRound(1)
    setCurrentPlayerIndex(0)
    setPlayers(players.map(p => ({ ...p, score: 0 })))
    setScreen('play')
  }

  const handleRoundEnd = (word: string, wasGuessed: boolean, updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers)
    setResultsData({
      word,
      wasGuessed,
      scores: Object.fromEntries(updatedPlayers.map(p => [p.id, p.score])),
    })
    setScreen('results')
  }

  const handleNextRound = () => {
    setCurrentRound(currentRound + 1)
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
    setScreen('play')
  }

  const difficulty = calculateDifficulty(players)

  const gameSettings: GameSettings = {
    mode: gameMode || 'charades',
    players,
    timeLimit,
    difficulty,
  }

  return (
    <div className="app">
      {screen === 'menu' && (
        <MainMenu onSelectMode={handleSelectMode} />
      )}
      {screen === 'setup' && gameMode && (
        <GameSetup
          mode={gameMode}
          players={players}
          timeLimit={timeLimit}
          difficulty={difficulty}
          onPlayersChange={setPlayers}
          onTimeLimitChange={setTimeLimit}
          onBack={handleBackToMenu}
          onStart={handleStartGame}
        />
      )}
      {screen === 'play' && (
        <GamePlay
          settings={gameSettings}
          currentRound={currentRound}
          currentPlayerIndex={currentPlayerIndex}
          onRoundEnd={handleRoundEnd}
          onBack={handleBackToMenu}
        />
      )}
      {screen === 'results' && resultsData && (
        <GameResults
          word={resultsData.word}
          wasGuessed={resultsData.wasGuessed}
          players={players}
          onMenu={handleBackToMenu}
          onNextRound={handleNextRound}
        />
      )}
    </div>
  )
}

export default App

import { useState, useEffect, useCallback, useRef } from 'react'
import { GameSettings, Player } from '../types'
import { getWordForDifficulty } from '../utils/wordGenerator'
import { getDifficultyLabel } from '../utils/difficulty'
import './GamePlay.css'

interface GamePlayProps {
  settings: GameSettings
  currentRound: number
  currentPlayerIndex: number
  onRoundEnd: (word: string, wasGuessed: boolean, updatedPlayers: Player[]) => void
  onBack: () => void
}

export function GamePlay({
  settings,
  currentRound,
  currentPlayerIndex,
  onRoundEnd,
  onBack,
}: GamePlayProps) {
  const [currentWord, setCurrentWord] = useState('')
  const [isWordRevealed, setIsWordRevealed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    settings.timeLimit === 'unlimited' ? null : settings.timeLimit
  )
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  const currentPlayer = settings.players[currentPlayerIndex]
  const isUnlimitedTime = settings.timeLimit === 'unlimited'

  // Generate word on mount
  useEffect(() => {
    const word = getWordForDifficulty(settings.difficulty, settings.mode, settings.categories)
    setCurrentWord(word)
  }, [settings.difficulty, settings.mode, settings.categories])

  const handleNewWord = () => {
    const word = getWordForDifficulty(settings.difficulty, settings.mode, settings.categories)
    setCurrentWord(word)
  }

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev > 0) {
            return prev - 1
          }
          return prev
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning, timeRemaining])

  // Handle time up
  useEffect(() => {
    if (timeRemaining === 0) {
      handleSkip()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining])

  const handleRevealWord = () => {
    setIsWordRevealed(true)
    if (!isUnlimitedTime) {
      setIsTimerRunning(true)
    }
  }

  const handleSkip = useCallback(() => {
    setIsTimerRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    onRoundEnd(currentWord, false, settings.players)
  }, [currentWord, onRoundEnd, settings.players])

  const handleGuessed = () => {
    setIsTimerRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    const updatedPlayers = settings.players.map((player, index) =>
      index === currentPlayerIndex ? { ...player, score: player.score + 1 } : player
    )
    onRoundEnd(currentWord, true, updatedPlayers)
  }

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '∞'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerProgress = (): number => {
    if (settings.timeLimit === 'unlimited' || timeRemaining === null) return 1
    return timeRemaining / settings.timeLimit
  }

  const ruleText = settings.mode === 'charades'
    ? 'Pokaż hasło gestami, bez mówienia i wskazywania!'
    : 'Opisuj hasło używając wyłącznie słów zaczynających się na P. Sam wymyślasz podpowiedzi!'

  return (
    <div className="game-play slide-up">
      <div className="play-card">
        <button className="back-button" onClick={onBack}>
          <span className="back-arrow">‹</span> Menu
        </button>

        <div className="play-header">
          <span className="round-badge">Runda {currentRound}</span>
          <span className="difficulty-badge">{getDifficultyLabel(settings.difficulty)}</span>
        </div>

        <div className="describer-section">
          <p className="describer-label">
            {settings.mode === 'charades' ? 'POKAZUJE' : 'OPISUJE (TYLKO SŁOWA NA P!)'}
          </p>
          <h2 className="describer-name">{currentPlayer.name}</h2>
        </div>

        <div className="timer-section">
          <div className="timer-circle" style={{ '--progress': getTimerProgress() } as React.CSSProperties}>
            <span className="timer-value">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        <div className="word-section">
          <p className="word-label">HASŁO — NACIŚNIJ ABY ODSŁONIĆ</p>
          {isWordRevealed ? (
            <div className="word-revealed">
              <span className="word-text">{currentWord}</span>
            </div>
          ) : (
            <button className="word-hidden" onClick={handleRevealWord}>
              <span className="eye-icon">👁</span>
              <span>Dotknij aby zobaczyć</span>
            </button>
          )}
          {settings.allowWordSkip && isWordRevealed && (
            <button className="new-word-button" onClick={handleNewWord}>
              🔄 Losuj nowe słowo
            </button>
          )}
        </div>

        <div className="rule-box">
          <span className="rule-icon">💡</span>
          <div className="rule-content">
            <span className="rule-title">Zasada</span>
            <p className="rule-text">{ruleText}</p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="skip-button" onClick={handleSkip}>
            <span>⏭</span> Pomiń
          </button>
          <button className="guessed-button" onClick={handleGuessed}>
            <span>✅</span> Zgadli!
          </button>
        </div>
      </div>
    </div>
  )
}

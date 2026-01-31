import { useMemo } from 'react'
import { Player } from '../types'
import './GameResults.css'

interface GameResultsProps {
  word: string
  wasGuessed: boolean
  players: Player[]
  onMenu: () => void
  onNextRound: () => void
}

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
}

export function GameResults({
  word,
  wasGuessed,
  players,
  onMenu,
  onNextRound,
}: GameResultsProps) {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const leadingScore = sortedPlayers[0]?.score || 0

  const confetti = useMemo<ConfettiPiece[]>(() => {
    if (!wasGuessed) return []
    const colors = ['#f38181', '#3dccc7', '#ffd700', '#4ade80', '#a855f7', '#f472b6']
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [wasGuessed])

  return (
    <div className="game-results">
      {wasGuessed && (
        <div className="confetti-container">
          {confetti.map(piece => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                backgroundColor: piece.color,
              }}
            />
          ))}
        </div>
      )}

      <div className="results-card slide-up">
        <div className="results-header">
          <span className="results-emoji">{wasGuessed ? '🎉' : '⏰'}</span>
          <h1 className={`results-title ${wasGuessed ? 'success' : 'failure'}`}>
            {wasGuessed ? 'Brawo!' : 'Czas minął!'}
          </h1>
        </div>

        <p className="word-label">
          {wasGuessed ? 'Odgadnięte hasło:' : 'Hasło było:'}
        </p>
        <p className="word-display">{word}</p>

        <div className="scores-section">
          <h2 className="scores-title">WYNIKI</h2>
          <div className="scores-list">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="score-row">
                <div className="score-position">
                  {player.score === leadingScore && player.score > 0 ? (
                    <span className="crown">👑</span>
                  ) : (
                    <span className="position-number">{index + 1}.</span>
                  )}
                </div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-age">({player.age} lat)</span>
                </div>
                <span className="player-score" data-testid="player-score">
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="results-buttons">
          <button className="menu-button" onClick={onMenu}>
            <span>🏠</span> Menu
          </button>
          <button className="next-round-button" onClick={onNextRound}>
            <span>➡️</span> Następna runda
          </button>
        </div>
      </div>
    </div>
  )
}

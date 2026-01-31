import { GameMode, Player, TimeLimit, Difficulty } from '../types'
import { getDifficultyLabel, getYoungestPlayerAge } from '../utils/difficulty'
import './GameSetup.css'

interface GameSetupProps {
  mode: GameMode
  players: Player[]
  timeLimit: TimeLimit
  difficulty: Difficulty
  onPlayersChange: (players: Player[]) => void
  onTimeLimitChange: (timeLimit: TimeLimit) => void
  onBack: () => void
  onStart: () => void
}

const TIME_OPTIONS: TimeLimit[] = [30, 45, 60, 90, 120, 'unlimited']

export function GameSetup({
  mode,
  players,
  timeLimit,
  difficulty,
  onPlayersChange,
  onTimeLimitChange,
  onBack,
  onStart,
}: GameSetupProps) {
  const gameTitle = mode === 'charades' ? 'Kalambury' : 'Gra na P'
  const gameDescription = mode === 'charades'
    ? 'Pokaż gestami, niech inni zgadną!'
    : 'Opisujesz hasło używając wyłącznie słów na literę P'
  const youngestAge = getYoungestPlayerAge(players)

  const handlePlayerNameChange = (id: string, name: string) => {
    onPlayersChange(players.map(p => p.id === id ? { ...p, name } : p))
  }

  const handlePlayerAgeChange = (id: string, age: number) => {
    onPlayersChange(players.map(p => p.id === id ? { ...p, age: Math.max(1, age) } : p))
  }

  const handleAddPlayer = () => {
    const newId = String(Date.now())
    onPlayersChange([...players, { id: newId, name: '', age: 18, score: 0 }])
  }

  const handleRemovePlayer = (id: string) => {
    if (players.length > 2) {
      onPlayersChange(players.filter(p => p.id !== id))
    }
  }

  const canStart = players.every(p => p.name.trim() !== '') && players.length >= 2

  return (
    <div className="game-setup slide-up">
      <div className="setup-card">
        <button className="back-button" onClick={onBack}>
          <span className="back-arrow">‹</span> Powrót
        </button>

        <div className="game-header">
          {mode === 'p-game' ? (
            <span className="game-icon-letter">P</span>
          ) : (
            <span className="game-icon">🎭</span>
          )}
          <h1 className="game-title">{gameTitle}</h1>
        </div>
        <p className="game-description">{gameDescription}</p>

        <section className="players-section">
          <h2 className="section-title">GRACZE</h2>
          <div className="players-list">
            {players.map((player, index) => (
              <div key={player.id} className="player-row">
                <span className="player-number">{index + 1}</span>
                <input
                  type="text"
                  className="player-name-input"
                  value={player.name}
                  onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                  placeholder={`Gracz ${index + 1}`}
                />
                <div className="age-input-group">
                  <input
                    type="number"
                    className="player-age-input"
                    value={player.age}
                    onChange={(e) => handlePlayerAgeChange(player.id, parseInt(e.target.value) || 1)}
                    min={1}
                    max={120}
                  />
                  <span className="age-label">lat</span>
                </div>
                {players.length > 2 && (
                  <button
                    className="remove-player-button"
                    onClick={() => handleRemovePlayer(player.id)}
                    aria-label="Usuń gracza"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="add-player-button" onClick={handleAddPlayer}>
            + Dodaj gracza
          </button>
        </section>

        <div className="difficulty-indicator">
          <span className="difficulty-icon">⭐</span>
          <div className="difficulty-info">
            <span className="difficulty-label">
              Poziom: <span className="difficulty-value">{getDifficultyLabel(difficulty)}</span>
            </span>
            {youngestAge !== null && (
              <span className="difficulty-note">
                Dopasowany do najmłodszego gracza ({youngestAge} lat)
              </span>
            )}
          </div>
        </div>

        <section className="time-section">
          <h2 className="section-title">CZAS NA RUNDĘ</h2>
          <div className="time-options">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option}
                className={`time-option ${timeLimit === option ? 'active' : ''}`}
                onClick={() => onTimeLimitChange(option)}
              >
                {option === 'unlimited' ? '∞ bez limitu' : `${option}s`}
              </button>
            ))}
          </div>
        </section>

        <button
          className="start-button"
          onClick={onStart}
          disabled={!canStart}
        >
          🚀 Zaczynamy!
        </button>
      </div>
    </div>
  )
}

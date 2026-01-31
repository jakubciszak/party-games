import { GameMode } from '../types'
import './MainMenu.css'

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void
}

export function MainMenu({ onSelectMode }: MainMenuProps) {
  return (
    <div className="main-menu slide-up">
      <div className="menu-card">
        <h1 className="title">
          <span className="title-party">Party</span>
          <span className="title-games">Games</span>
        </h1>
        <p className="subtitle">WYBIERZ TRYB GRY</p>

        <div className="game-modes">
          <button
            className="game-mode-card charades"
            onClick={() => onSelectMode('charades')}
          >
            <span className="mode-icon">🎭🤫</span>
            <h2 className="mode-title">Kalambury</h2>
            <p className="mode-description">Pokaż gestami — niech zgadną!</p>
          </button>

          <button
            className="game-mode-card p-game"
            onClick={() => onSelectMode('p-game')}
          >
            <span className="mode-icon-letter">P</span>
            <h2 className="mode-title">Gra na P</h2>
            <p className="mode-description">Opisuj hasło używając tylko słów na literę P!</p>
          </button>
        </div>
      </div>
    </div>
  )
}

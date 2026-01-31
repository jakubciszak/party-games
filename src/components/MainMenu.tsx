import { GameMode } from '../types'
import './MainMenu.css'

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void
}

function Logo() {
  return (
    <div className="logo-container">
      <div className="logo">
        {/* Kostka do gry */}
        <div className="dice">
          <div className="dice-face">
            <span className="dot dot-1"></span>
            <span className="dot dot-2"></span>
            <span className="dot dot-3"></span>
            <span className="dot dot-4"></span>
            <span className="dot dot-5"></span>
            <span className="dot dot-6"></span>
          </div>
        </div>
        {/* Balony */}
        <div className="balloon balloon-1"></div>
        <div className="balloon balloon-2"></div>
        <div className="balloon balloon-3"></div>
        {/* Konfetti */}
        <div className="confetti confetti-1"></div>
        <div className="confetti confetti-2"></div>
        <div className="confetti confetti-3"></div>
        <div className="confetti confetti-4"></div>
        <div className="confetti confetti-5"></div>
        {/* Gwiazdki */}
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
      </div>
    </div>
  )
}

export function MainMenu({ onSelectMode }: MainMenuProps) {
  return (
    <div className="main-menu slide-up">
      <div className="menu-card">
        <Logo />
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

        <div className="api-attribution">
          <a href="https://poocoo.pl" target="_blank" rel="noopener noreferrer">
            Word data powered by poocoo
          </a>
        </div>
      </div>
    </div>
  )
}

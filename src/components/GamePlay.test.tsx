import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GamePlay } from './GamePlay'
import { GameSettings, Player, ALL_CATEGORIES } from '../types'

describe('GamePlay', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Tata', age: 30, score: 0 },
    { id: '2', name: 'Tymek', age: 10, score: 0 },
  ]

  const defaultSettings: GameSettings = {
    mode: 'p-game',
    players: mockPlayers,
    timeLimit: 60,
    difficulty: 'easy',
    categories: [...ALL_CATEGORIES],
    allowWordSkip: true,
  }

  const defaultProps = {
    settings: defaultSettings,
    currentRound: 1,
    currentPlayerIndex: 0,
    onRoundEnd: vi.fn(),
    onBack: vi.fn(),
  }

  it('should display round number', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText('Runda 1')).toBeInTheDocument()
  })

  it('should display difficulty badge', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText('łatwy')).toBeInTheDocument()
  })

  it('should display current player name', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText('Tata')).toBeInTheDocument()
  })

  it('should display timer', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText('1:00')).toBeInTheDocument()
  })

  it('should display touch to reveal text', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText('Dotknij aby zobaczyć')).toBeInTheDocument()
  })

  it('should display skip and guessed buttons', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText(/Pomiń/)).toBeInTheDocument()
    expect(screen.getByText(/Zgadli!/)).toBeInTheDocument()
  })

  it('should display rules for p-game mode', () => {
    render(<GamePlay {...defaultProps} />)
    expect(screen.getByText(/Zasada/)).toBeInTheDocument()
    expect(screen.getByText(/słów zaczynających się na P/)).toBeInTheDocument()
  })

  it('should display rules for charades mode', () => {
    render(<GamePlay {...defaultProps} settings={{ ...defaultSettings, mode: 'charades' }} />)
    expect(screen.getByText(/Zasada/)).toBeInTheDocument()
    expect(screen.getByText(/gestami/i)).toBeInTheDocument()
  })

  it('should reveal word when touched', () => {
    render(<GamePlay {...defaultProps} />)

    const revealButton = screen.getByText('Dotknij aby zobaczyć')
    fireEvent.click(revealButton)

    // Word should now be visible (we can't check exact word as it's random)
    expect(screen.queryByText('Dotknij aby zobaczyć')).not.toBeInTheDocument()
  })
})

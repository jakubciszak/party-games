import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameSetup } from './GameSetup'
import { Player } from '../types'

describe('GameSetup', () => {
  const defaultPlayers: Player[] = [
    { id: '1', name: 'Gracz 1', age: 25, score: 0 },
    { id: '2', name: 'Gracz 2', age: 30, score: 0 },
  ]

  const defaultProps = {
    mode: 'p-game' as const,
    players: defaultPlayers,
    timeLimit: 60 as const,
    difficulty: 'hard' as const,
    onPlayersChange: vi.fn(),
    onTimeLimitChange: vi.fn(),
    onBack: vi.fn(),
    onStart: vi.fn(),
  }

  it('should display game title for p-game mode', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByText('Gra na P')).toBeInTheDocument()
  })

  it('should display game title for charades mode', () => {
    render(<GameSetup {...defaultProps} mode="charades" />)
    expect(screen.getByText('Kalambury')).toBeInTheDocument()
  })

  it('should display back button', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByText(/Powrót/)).toBeInTheDocument()
  })

  it('should call onBack when back button is clicked', () => {
    const onBack = vi.fn()
    render(<GameSetup {...defaultProps} onBack={onBack} />)

    fireEvent.click(screen.getByText(/Powrót/))
    expect(onBack).toHaveBeenCalled()
  })

  it('should display player inputs', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByDisplayValue('Gracz 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Gracz 2')).toBeInTheDocument()
  })

  it('should display player ages', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByDisplayValue('25')).toBeInTheDocument()
    expect(screen.getByDisplayValue('30')).toBeInTheDocument()
  })

  it('should display add player button', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByText('+ Dodaj gracza')).toBeInTheDocument()
  })

  it('should display time limit options', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByText('30s')).toBeInTheDocument()
    expect(screen.getByText('45s')).toBeInTheDocument()
    expect(screen.getByText('60s')).toBeInTheDocument()
    expect(screen.getByText('90s')).toBeInTheDocument()
    expect(screen.getByText('120s')).toBeInTheDocument()
    expect(screen.getByText(/bez limitu/)).toBeInTheDocument()
  })

  it('should display difficulty based on youngest player', () => {
    const youngPlayers: Player[] = [
      { id: '1', name: 'Tata', age: 30, score: 0 },
      { id: '2', name: 'Tymek', age: 10, score: 0 },
    ]
    render(<GameSetup {...defaultProps} players={youngPlayers} difficulty="easy" />)
    expect(screen.getByText(/łatwy/)).toBeInTheDocument()
    expect(screen.getByText(/10 lat/)).toBeInTheDocument()
  })

  it('should display start button', () => {
    render(<GameSetup {...defaultProps} />)
    expect(screen.getByText(/Zaczynamy/)).toBeInTheDocument()
  })

  it('should call onStart when start button is clicked', () => {
    const onStart = vi.fn()
    render(<GameSetup {...defaultProps} onStart={onStart} />)

    fireEvent.click(screen.getByText(/Zaczynamy/))
    expect(onStart).toHaveBeenCalled()
  })

  it('should call onTimeLimitChange when time option is selected', () => {
    const onTimeLimitChange = vi.fn()
    render(<GameSetup {...defaultProps} onTimeLimitChange={onTimeLimitChange} />)

    fireEvent.click(screen.getByText('30s'))
    expect(onTimeLimitChange).toHaveBeenCalledWith(30)
  })
})

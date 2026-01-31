import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameResults } from './GameResults'
import { Player } from '../types'

describe('GameResults', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Tata', age: 30, score: 1 },
    { id: '2', name: 'Tymek', age: 10, score: 0 },
  ]

  const defaultProps = {
    word: 'dziadek',
    wasGuessed: true,
    players: mockPlayers,
    onMenu: vi.fn(),
    onNextRound: vi.fn(),
  }

  it('should display success message when word was guessed', () => {
    render(<GameResults {...defaultProps} />)
    expect(screen.getByText('Brawo!')).toBeInTheDocument()
  })

  it('should display failure message when word was not guessed', () => {
    render(<GameResults {...defaultProps} wasGuessed={false} />)
    expect(screen.getByText('Czas minął!')).toBeInTheDocument()
  })

  it('should display the word', () => {
    render(<GameResults {...defaultProps} />)
    expect(screen.getByText('dziadek')).toBeInTheDocument()
  })

  it('should display player scores', () => {
    render(<GameResults {...defaultProps} />)
    expect(screen.getByText('Tata')).toBeInTheDocument()
    expect(screen.getByText('(30 lat)')).toBeInTheDocument()
    expect(screen.getByText('Tymek')).toBeInTheDocument()
    expect(screen.getByText('(10 lat)')).toBeInTheDocument()
  })

  it('should display menu button', () => {
    render(<GameResults {...defaultProps} />)
    expect(screen.getByText(/Menu/)).toBeInTheDocument()
  })

  it('should display next round button', () => {
    render(<GameResults {...defaultProps} />)
    expect(screen.getByText(/Następna runda/)).toBeInTheDocument()
  })

  it('should call onMenu when menu button is clicked', () => {
    const onMenu = vi.fn()
    render(<GameResults {...defaultProps} onMenu={onMenu} />)

    fireEvent.click(screen.getByText(/Menu/))
    expect(onMenu).toHaveBeenCalled()
  })

  it('should call onNextRound when next round button is clicked', () => {
    const onNextRound = vi.fn()
    render(<GameResults {...defaultProps} onNextRound={onNextRound} />)

    fireEvent.click(screen.getByText(/Następna runda/))
    expect(onNextRound).toHaveBeenCalled()
  })

  it('should show crown for leading player', () => {
    render(<GameResults {...defaultProps} />)
    // Tata has score 1, should have crown
    const scores = screen.getAllByTestId('player-score')
    expect(scores[0]).toHaveTextContent('1')
  })
})

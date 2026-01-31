import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MainMenu } from './MainMenu'

describe('MainMenu', () => {
  it('should display the game title', () => {
    render(<MainMenu onSelectMode={vi.fn()} />)
    expect(screen.getByText('Party')).toBeInTheDocument()
    expect(screen.getByText('Games')).toBeInTheDocument()
  })

  it('should display game mode selection text', () => {
    render(<MainMenu onSelectMode={vi.fn()} />)
    expect(screen.getByText('WYBIERZ TRYB GRY')).toBeInTheDocument()
  })

  it('should display Kalambury option', () => {
    render(<MainMenu onSelectMode={vi.fn()} />)
    expect(screen.getByText('Kalambury')).toBeInTheDocument()
    expect(screen.getByText(/Pokaż gestami/)).toBeInTheDocument()
  })

  it('should display Gra na P option', () => {
    render(<MainMenu onSelectMode={vi.fn()} />)
    expect(screen.getByText('Gra na P')).toBeInTheDocument()
    expect(screen.getByText(/Opisuj hasło używając tylko słów na literę P/)).toBeInTheDocument()
  })

  it('should call onSelectMode with charades when Kalambury is clicked', () => {
    const onSelectMode = vi.fn()
    render(<MainMenu onSelectMode={onSelectMode} />)

    fireEvent.click(screen.getByText('Kalambury'))
    expect(onSelectMode).toHaveBeenCalledWith('charades')
  })

  it('should call onSelectMode with p-game when Gra na P is clicked', () => {
    const onSelectMode = vi.fn()
    render(<MainMenu onSelectMode={onSelectMode} />)

    fireEvent.click(screen.getByText('Gra na P'))
    expect(onSelectMode).toHaveBeenCalledWith('p-game')
  })
})

import { describe, it, expect } from 'vitest'
import { generateScoreCard } from '@/lib/share'

describe('generateScoreCard', () => {
  it('generates a text score card', () => {
    const card = generateScoreCard({
      dayNumber: 47,
      themeName: 'Rocket Cart Cats',
      roundReached: 2,
      score: 1340,
      status: 'dead',
    })

    expect(card).toContain('QUARTER #47')
    expect(card).toContain('Rocket Cart Cats')
    expect(card).toContain('Round 2')
    expect(card).toContain('1,340')
  })

  it('shows CLEARED for victory', () => {
    const card = generateScoreCard({
      dayNumber: 47,
      themeName: 'Rocket Cart Cats',
      roundReached: 3,
      score: 4200,
      status: 'victory',
    })

    expect(card).toContain('CLEARED')
    expect(card).toContain('4,200')
  })

  it('includes progress bar', () => {
    const card = generateScoreCard({
      dayNumber: 10,
      themeName: 'Test',
      roundReached: 2,
      score: 1000,
      status: 'dead',
    })

    expect(card).toMatch(/[█▓░]/)
  })
})

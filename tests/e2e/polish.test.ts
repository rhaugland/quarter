import { describe, it, expect } from 'vitest'
import { getDayNumber, formatCountdown } from '@/lib/time'
import { getRankTitle } from '@/lib/streaks'

describe('Polish integration', () => {
  it('day number is consistent with scoring', () => {
    const day = getDayNumber()
    expect(day).toBe(Math.floor(Date.now() / (1000 * 60 * 60 * 24)))
  })

  it('countdown formats correctly', () => {
    expect(formatCountdown(3661)).toBe('01:01:01')
    expect(formatCountdown(0)).toBe('00:00:00')
    expect(formatCountdown(86399)).toBe('23:59:59')
  })

  it('rank titles cover full progression', () => {
    expect(getRankTitle(0)).toBe('Rookie')
    expect(getRankTitle(1)).toBe('Rookie')
    expect(getRankTitle(7)).toBe('Regular')
    expect(getRankTitle(30)).toBe('Veteran')
    expect(getRankTitle(60)).toBe('Cabinet Rat')
    expect(getRankTitle(100)).toBe('Machine Lord')
    expect(getRankTitle(200)).toBe('Quarter Legend')
    expect(getRankTitle(365)).toBe('The Operator')
    expect(getRankTitle(1000)).toBe('The Operator')
  })
})

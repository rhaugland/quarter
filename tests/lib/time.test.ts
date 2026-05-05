import { describe, it, expect, vi } from 'vitest'
import { getDayNumber, getSecondsUntilMidnightUTC } from '@/lib/time'

describe('time utilities', () => {
  it('getDayNumber returns consistent value for same day', () => {
    const day = getDayNumber()
    expect(day).toBeGreaterThan(20000)
    expect(typeof day).toBe('number')
  })

  it('getSecondsUntilMidnightUTC returns a number between 0 and 86400', () => {
    const seconds = getSecondsUntilMidnightUTC()
    expect(seconds).toBeGreaterThanOrEqual(0)
    expect(seconds).toBeLessThanOrEqual(86400)
  })

  it('getSecondsUntilMidnightUTC returns correct value for known time', () => {
    vi.setSystemTime(new Date('2026-05-05T23:00:00Z'))
    const seconds = getSecondsUntilMidnightUTC()
    expect(seconds).toBe(3600)
    vi.useRealTimers()
  })
})

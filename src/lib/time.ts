export function getDayNumber(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24))
}

export function getSecondsUntilMidnightUTC(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setUTCDate(midnight.getUTCDate() + 1)
  midnight.setUTCHours(0, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

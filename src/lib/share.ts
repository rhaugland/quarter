interface ScoreCardInput {
  dayNumber: number
  themeName: string
  roundReached: number
  score: number
  status: 'dead' | 'victory'
}

export function generateScoreCard(input: ScoreCardInput): string {
  const { dayNumber, themeName, roundReached, score, status } = input

  const formattedScore = score.toLocaleString()
  const progressBar = generateProgressBar(roundReached, status)
  const statusLine = status === 'victory'
    ? `CLEARED | Score: ${formattedScore}`
    : `Round ${roundReached} | Score: ${formattedScore}`

  return [
    `🕹️ QUARTER #${dayNumber}`,
    themeName,
    statusLine,
    progressBar,
  ].join('\n')
}

function generateProgressBar(roundReached: number, status: 'dead' | 'victory'): string {
  if (status === 'victory') return '███████████'

  const filled = roundReached
  const empty = 3 - roundReached
  return '███'.repeat(filled) + '░░░'.repeat(empty)
}

export function getShareUrl(dayNumber: number): string {
  return `https://playquarter.com/day/${dayNumber}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

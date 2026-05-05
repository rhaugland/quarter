import { NextResponse } from 'next/server'
import { getOrCreatePlayer } from '@/lib/auth'
import { submitScore } from '@/lib/score-service'
import { getRankTitle } from '@/lib/streaks'

export async function POST(request: Request) {
  const body = await request.json()
  const { deviceId, dayNumber, score, roundReached, status, themeName } = body

  if (!deviceId || !dayNumber || score === undefined || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const player = await getOrCreatePlayer(deviceId)
  if (!player) {
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 401 })
  }

  const streakData = await submitScore({
    playerId: player.id,
    dayNumber,
    score,
    roundReached,
    status,
    themeName,
  })

  if (!streakData) {
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 })
  }

  return NextResponse.json({
    streak: streakData,
    title: getRankTitle(streakData.currentStreak),
  })
}

import { NextResponse } from 'next/server'
import { getOrCreatePlayer } from '@/lib/auth'
import { submitGraveyardMessage, getGraveyardMessages } from '@/lib/graveyard-service'

export async function POST(request: Request) {
  const body = await request.json()
  const { deviceId, dayNumber, message, roundReached } = body

  if (!deviceId || !dayNumber || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const player = await getOrCreatePlayer(deviceId)
  if (!player) {
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 401 })
  }

  const success = await submitGraveyardMessage({
    playerId: player.id,
    dayNumber,
    message,
    roundReached: roundReached ?? 1,
  })

  if (!success) {
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dayNumber = parseInt(searchParams.get('day') ?? '0')

  if (!dayNumber) {
    return NextResponse.json({ error: 'Missing day parameter' }, { status: 400 })
  }

  const messages = await getGraveyardMessages(dayNumber)
  return NextResponse.json({ messages })
}

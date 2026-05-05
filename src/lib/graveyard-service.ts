import { getServiceClient } from './supabase-server'

interface SubmitGraveyardInput {
  playerId: string
  dayNumber: number
  message: string
  roundReached: number
}

export interface GraveyardMessage {
  id: number
  message: string
  roundReached: number
  displayName: string | null
  createdAt: string
}

export async function submitGraveyardMessage(input: SubmitGraveyardInput): Promise<boolean> {
  const { playerId, dayNumber, message, roundReached } = input

  if (message.length > 100 || message.length === 0) {
    return false
  }

  const supabase = getServiceClient()
  const { error } = await supabase
    .from('graveyard')
    .insert({
      player_id: playerId,
      day_number: dayNumber,
      message,
      round_reached: roundReached,
    })

  if (error) {
    console.error('Failed to submit graveyard message:', error)
    return false
  }

  return true
}

export async function getGraveyardMessages(dayNumber: number, limit: number = 50): Promise<GraveyardMessage[]> {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('graveyard')
    .select('id, message, round_reached, players(display_name, device_id), created_at')
    .eq('day_number', dayNumber)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((row: any) => ({
    id: row.id,
    message: row.message,
    roundReached: row.round_reached,
    displayName: row.players?.display_name ?? null,
    createdAt: row.created_at,
  }))
}

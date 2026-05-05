import { getServiceClient } from './supabase-server'

// Client-side: generate and persist device ID
export function getOrCreateDeviceId(): string {
  const id = crypto.randomUUID()
  if (typeof window === 'undefined') {
    return id
  }
  try {
    const stored = localStorage.getItem('quarter_device_id')
    if (stored) return stored
    localStorage.setItem('quarter_device_id', id)
  } catch {
    // localStorage unavailable (e.g. test environment) — return ephemeral ID
  }
  return id
}

export interface Player {
  id: string
  device_id: string
  display_name: string | null
}

// Server-side: find or create player by device ID
export async function getOrCreatePlayer(deviceId: string): Promise<Player | null> {
  const supabase = getServiceClient()

  // Try to find existing player
  const { data: existing, error: findError } = await supabase
    .from('players')
    .select('id, device_id, display_name')
    .eq('device_id', deviceId)
    .single()

  if (existing && !findError) {
    return existing as Player
  }

  // Create new player
  const { data: created, error: createError } = await supabase
    .from('players')
    .upsert({ device_id: deviceId }, { onConflict: 'device_id' })
    .select('id, device_id, display_name')
    .single()

  if (createError) {
    console.error('Failed to create player:', createError)
    return null
  }

  return created as Player
}

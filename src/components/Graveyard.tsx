'use client'

import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase-browser'

interface GraveyardEntry {
  id: number
  message: string
  roundReached: number
}

interface GraveyardProps {
  dayNumber: number
}

export function Graveyard({ dayNumber }: GraveyardProps) {
  const [entries, setEntries] = useState<GraveyardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGraveyard() {
      const supabase = getBrowserClient()
      const { data, error } = await supabase
        .from('graveyard')
        .select('id, message, round_reached')
        .eq('day_number', dayNumber)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error || !data) {
        setLoading(false)
        return
      }

      setEntries(data.map((row: any) => ({
        id: row.id,
        message: row.message,
        roundReached: row.round_reached,
      })))
      setLoading(false)
    }

    fetchGraveyard()
  }, [dayNumber])

  if (loading) return null

  if (entries.length === 0) {
    return <div className="text-green-400/30 font-mono text-xs">THE GRAVEYARD IS EMPTY... FOR NOW.</div>
  }

  return (
    <div className="w-full max-w-md space-y-1">
      <h3 className="text-green-400/60 font-mono text-xs uppercase tracking-wider mb-2">The Graveyard</h3>
      {entries.map((entry) => (
        <div key={entry.id} className="text-green-300/50 font-mono text-xs">
          💀 R{entry.roundReached} — &quot;{entry.message}&quot;
        </div>
      ))}
    </div>
  )
}

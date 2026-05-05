'use client'

import { useEffect, useState } from 'react'
import { getSecondsUntilMidnightUTC, formatCountdown } from '@/lib/time'

export function Countdown() {
  const [seconds, setSeconds] = useState<number>(getSecondsUntilMidnightUTC())

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getSecondsUntilMidnightUTC())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center font-mono">
      <div className="text-pink-400/40 text-xs uppercase tracking-wider mb-1">
        NEXT MACHINE IN
      </div>
      <div className="text-pink-400 text-2xl tracking-widest text-glow">
        {formatCountdown(seconds)}
      </div>
    </div>
  )
}

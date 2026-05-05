'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Leaderboard } from '@/components/Leaderboard'
import { Graveyard } from '@/components/Graveyard'
import Link from 'next/link'

function LeaderboardContent() {
  const searchParams = useSearchParams()
  const dayNumber = parseInt(searchParams.get('day') ?? String(Math.floor(Date.now() / (1000 * 60 * 60 * 24))))

  return (
    <div className="min-h-screen bg-black flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <Link href="/" className="text-green-400 font-mono text-2xl font-bold tracking-wider hover:text-green-300">
          QUARTER
        </Link>
        <p className="text-green-300/60 font-mono text-sm mt-1">DAY #{dayNumber}</p>
      </div>

      <Leaderboard dayNumber={dayNumber} />

      <div className="border-t border-green-500/20 w-full max-w-md" />

      <Graveyard dayNumber={dayNumber} />

      <Link
        href="/play"
        className="border border-green-500 text-green-400 font-mono text-sm px-6 py-2
                   hover:bg-green-500/10 transition-colors mt-4"
      >
        PLAY TODAY&apos;S MACHINE
      </Link>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><span className="text-green-400 font-mono animate-pulse">LOADING...</span></div>}>
      <LeaderboardContent />
    </Suspense>
  )
}

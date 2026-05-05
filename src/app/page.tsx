import Link from 'next/link'
import { CRTWrapper } from '@/components/CRTWrapper'
import { Countdown } from '@/components/Countdown'

export default function Home() {
  return (
    <CRTWrapper className="min-h-screen bg-black flex flex-col items-center justify-center gap-10 p-4">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-green-400 font-mono text-5xl sm:text-7xl font-bold tracking-widest text-glow">
          QUARTER
        </h1>
        <p className="text-green-300/50 font-mono text-sm sm:text-lg mt-4 tracking-wide">
          ONE GAME. ONE SHOT. EVERY DAY.
        </p>
      </div>

      {/* Insert Quarter Button */}
      <Link
        href="/play"
        className="border-2 border-green-500 text-green-400 font-mono text-xl sm:text-2xl px-10 sm:px-14 py-4
                   hover:bg-green-500/10 glow-pulse
                   transition-all duration-200 tracking-wider"
      >
        INSERT QUARTER
      </Link>

      {/* Countdown */}
      <Countdown />

      {/* Footer info */}
      <div className="text-center space-y-2 mt-4">
        <p className="text-green-300/30 font-mono text-xs">
          A new machine appears at midnight UTC
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/leaderboard" className="text-green-400/40 font-mono text-xs hover:text-green-400/70 transition-colors">
            LEADERBOARD
          </Link>
          <span className="text-green-400/20">|</span>
          <span className="text-green-400/40 font-mono text-xs">
            ARROWS/WASD + SPACE
          </span>
        </div>
      </div>
    </CRTWrapper>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-green-400 font-mono text-6xl font-bold tracking-widest">
          QUARTER
        </h1>
        <p className="text-green-300/60 font-mono text-lg mt-4">
          ONE GAME. ONE SHOT. EVERY DAY.
        </p>
      </div>

      <Link
        href="/play"
        className="border-2 border-green-500 text-green-400 font-mono text-2xl px-12 py-4
                   hover:bg-green-500/10 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]
                   transition-all duration-200 tracking-wider"
      >
        INSERT QUARTER
      </Link>

      <p className="text-green-300/30 font-mono text-xs mt-8">
        A new machine appears at midnight UTC
      </p>
    </div>
  )
}

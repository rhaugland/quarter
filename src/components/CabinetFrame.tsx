'use client'

interface CabinetFrameProps {
  children: React.ReactNode
  title?: string
  dayNumber?: number
}

export function CabinetFrame({ children, title, dayNumber }: CabinetFrameProps) {
  return (
    <div className="relative border-2 border-pink-500/80 rounded-lg overflow-hidden
                    shadow-[0_0_30px_rgba(236, 72, 153,0.15),inset_0_0_30px_rgba(236, 72, 153,0.05)]">
      {/* Top bar */}
      {(title || dayNumber !== undefined) && (
        <div className="bg-pink-500/10 border-b border-pink-500/30 px-4 py-2 flex justify-between items-center">
          <span className="text-pink-400/80 font-mono text-xs tracking-wider">
            {dayNumber !== undefined ? `DAY #${dayNumber}` : ''}
          </span>
          <span className="text-pink-300/60 font-mono text-xs">
            {title ?? ''}
          </span>
          <span className="text-pink-400/40 font-mono text-xs">
            QUARTER
          </span>
        </div>
      )}

      {/* Content */}
      <div className="relative">
        {children}
      </div>

      {/* Bottom bar */}
      <div className="bg-pink-500/5 border-t border-pink-500/20 px-4 py-1.5 text-center">
        <span className="text-pink-400/30 font-mono text-[10px] tracking-widest">
          ● REC
        </span>
      </div>
    </div>
  )
}

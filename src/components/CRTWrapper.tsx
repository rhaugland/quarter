'use client'

interface CRTWrapperProps {
  children: React.ReactNode
  className?: string
}

export function CRTWrapper({ children, className = '' }: CRTWrapperProps) {
  return (
    <div className={`relative crt-flicker ${className}`}>
      {children}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  )
}

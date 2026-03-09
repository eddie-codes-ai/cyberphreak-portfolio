'use client'

// --- PanelShell — reusable panel wrapper ---

import { ReactNode } from 'react'

interface PanelShellProps {
  title: string
  children: ReactNode
  className?: string
  dotColor?: string
  titleRight?: ReactNode
}

export default function PanelShell({
  title,
  children,
  className = '',
  dotColor = '#BC13FE',
  titleRight,
}: PanelShellProps) {
  return (
    <div
      className={`panel-glass flex flex-col overflow-hidden ${className}`}
      style={{ minHeight: 0 }}
    >
      <div
        className="flex items-center justify-between shrink-0 px-3 py-2"
        style={{
          borderBottom: '1px solid rgba(188,19,254,0.25)',
          background: 'rgba(188,19,254,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
          />
          <span
            className="font-display text-xs tracking-widest select-none"
            style={{ color: '#C8A8E9', letterSpacing: '0.2em' }}
          >
            <span className="bracket">[[</span>
            {title}
            <span className="bracket">]]</span>
          </span>
        </div>
        {titleRight && (
          <div className="text-xs font-mono" style={{ color: '#BC13FE' }}>
            {titleRight}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  )
}
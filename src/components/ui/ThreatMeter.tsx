'use client'

// --- ThreatMeter — bar that maps mouseSpeed → threat % → label ---

import { getThreatConfig } from '@/lib/constants'
import { mouseSpeedToThreatPct } from '@/lib/utils'

interface ThreatMeterProps {
  mouseSpeed: number
}

export default function ThreatMeter({ mouseSpeed }: ThreatMeterProps) {
  const pct    = mouseSpeedToThreatPct(mouseSpeed)
  const config = getThreatConfig(pct)
  const isCrit = config.label === 'CRITICAL'

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* --- Header row --- */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: 'rgba(200,168,233,0.6)', letterSpacing: '0.15em' }}
        >
          THREAT LEVEL
        </span>
        <span
          className={`font-retro text-lg tracking-widest ${isCrit ? 'threat-critical' : ''}`}
          style={{
            color: config.color,
            textShadow: `0 0 10px ${config.color}, 0 0 24px ${config.color}60`,
            letterSpacing: '0.2em',
          }}
        >
          {config.label}
        </span>
      </div>

      {/* --- Bar track --- */}
      <div
        className="relative w-full h-3 overflow-hidden"
        style={{
          background: 'rgba(188,19,254,0.1)',
          border: '1px solid rgba(188,19,254,0.25)',
        }}
      >
        {[25, 50, 75].map(tick => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${tick}%`, background: 'rgba(188,19,254,0.3)' }}
          />
        ))}
        <div
          className="absolute left-0 top-0 bottom-0 transition-all duration-200"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${config.color}60, ${config.color})`,
            boxShadow: `0 0 8px ${config.color}, inset 0 0 4px ${config.color}40`,
          }}
        />
      </div>

      {/* --- Percent readout --- */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs" style={{ color: 'rgba(200,168,233,0.4)' }}>0%</span>
        <span className="font-retro text-sm" style={{ color: config.color, textShadow: `0 0 8px ${config.color}` }}>
          {Math.round(pct)}%
        </span>
        <span className="font-mono text-xs" style={{ color: 'rgba(200,168,233,0.4)' }}>100%</span>
      </div>

      {/* --- Zone labels --- */}
      <div className="flex justify-between font-mono" style={{ fontSize: 9 }}>
        <span style={{ color: '#00FF88' }}>LOW</span>
        <span style={{ color: '#FFE600' }}>MED</span>
        <span style={{ color: '#FF4444' }}>HIGH</span>
        <span style={{ color: '#FF0000' }}>CRIT</span>
      </div>
    </div>
  )
}
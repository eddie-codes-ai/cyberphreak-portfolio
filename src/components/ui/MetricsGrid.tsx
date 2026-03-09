'use client'

// --- MetricsGrid — 4-cell system metrics display ---

import { useMetrics } from '@/hooks/useMetrics'

const METRIC_COLORS: Record<string, string> = {
  CPU:    '#FF2D9B',
  MEM:    '#BC13FE',
  'PKT/S':'#00FFE7',
  SESS:   '#FFE600',
}

interface MetricCellProps {
  label: string
  value: string
}

function MetricCell({ label, value }: MetricCellProps) {
  const accent = METRIC_COLORS[label] ?? '#BC13FE'

  return (
    <div
      className="flex flex-col gap-1 p-2"
      style={{
        background: 'rgba(188,19,254,0.05)',
        border: '1px solid rgba(188,19,254,0.2)',
      }}
    >
      <span
        className="font-mono tracking-widest"
        style={{ fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.2em' }}
      >
        {label}
      </span>
      <span
        className="font-retro"
        style={{
          fontSize: 26,
          color: accent,
          textShadow: `0 0 10px ${accent}, 0 0 24px ${accent}60`,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <div className="w-full h-0.5" style={{ background: 'rgba(188,19,254,0.15)' }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${getBarWidth(label, value)}%`,
            background: accent,
            boxShadow: `0 0 4px ${accent}`,
          }}
        />
      </div>
    </div>
  )
}

function getBarWidth(label: string, value: string): number {
  const num = parseFloat(value)
  if (isNaN(num)) return 0
  switch (label) {
    case 'CPU':    return Math.min(num, 100)
    case 'MEM':    return Math.min((num / 16) * 100, 100)
    case 'PKT/S':  return Math.min((num / 5) * 100, 100)
    case 'SESS':   return Math.min((num / 32) * 100, 100)
    default:       return 50
  }
}

export default function MetricsGrid() {
  const metrics = useMetrics()

  const cells = [
    { label: 'CPU',    value: metrics.cpu  },
    { label: 'MEM',    value: metrics.mem  },
    { label: 'PKT/S',  value: metrics.pkt  },
    { label: 'SESS',   value: metrics.sess },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {cells.map(cell => (
        <MetricCell key={cell.label} {...cell} />
      ))}
    </div>
  )
}
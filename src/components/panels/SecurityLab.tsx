'use client'

// --- SecurityLab — threat meter + 3D key + metrics ---

import PanelShell from '@/components/ui/PanelShell'
import ThreatMeter from '@/components/ui/ThreatMeter'
import KeyModel3D from '@/components/ui/KeyModel3D'
import MetricsGrid from '@/components/ui/MetricsGrid'
import { getThreatConfig } from '@/lib/constants'
import { mouseSpeedToThreatPct } from '@/lib/utils'

interface SecurityLabProps {
  mouseSpeed: number
}

export default function SecurityLab({ mouseSpeed }: SecurityLabProps) {
  const pct    = mouseSpeedToThreatPct(mouseSpeed)
  const config = getThreatConfig(pct)

  return (
    <PanelShell
      title="SECURITY LAB"
      dotColor={config.color}
      titleRight={
        <span style={{ color: config.color, fontSize: 10, letterSpacing: '0.15em' }}>
          {config.label}
        </span>
      }
      className="h-full"
    >
      <div className="flex flex-col gap-4 p-3 h-full overflow-y-auto">
        <div className="w-full relative" style={{ borderBottom: '1px solid rgba(188,19,254,0.15)', paddingBottom: 8 }}>
          <KeyModel3D />
          <div className="absolute top-2 left-2 font-mono" style={{ fontSize: 9, color: 'rgba(188,19,254,0.5)', letterSpacing: '0.18em' }}>
            ENCRYPTION KEY · AES-256
          </div>
        </div>
        <div className="w-full" style={{ borderBottom: '1px solid rgba(188,19,254,0.15)', paddingBottom: 12 }}>
          <ThreatMeter mouseSpeed={mouseSpeed} />
          <p className="font-mono mt-2" style={{ fontSize: 9, color: 'rgba(200,168,233,0.35)', letterSpacing: '0.1em' }}>
            SENSOR: MOUSE VELOCITY · UPDATE: 60Hz
          </p>
        </div>
        <div className="w-full">
          <div className="font-mono mb-2" style={{ fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.2em' }}>
            SYS METRICS
          </div>
          <MetricsGrid />
        </div>
      </div>
    </PanelShell>
  )
}
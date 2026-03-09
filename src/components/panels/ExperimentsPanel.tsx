'use client'

// --- ExperimentsPanel — project cards grid ---

import PanelShell from '@/components/ui/PanelShell'
import ExperimentCard from '@/components/ui/ExperimentCard'
import { DEFAULT_EXPERIMENTS } from '@/lib/constants'

export default function ExperimentsPanel() {
  const activeCount = DEFAULT_EXPERIMENTS.filter(e => e.status === 'ACTIVE').length

  return (
    <PanelShell
      title="EXPERIMENTS"
      dotColor="#FF2D9B"
      titleRight={
        <span style={{ color: '#00FF88', fontSize: 10, letterSpacing: '0.12em' }}>
          {activeCount} ACTIVE
        </span>
      }
      className="h-full"
    >
      <div className="flex flex-col gap-2 p-3 h-full overflow-y-auto">
        {DEFAULT_EXPERIMENTS.map((card, i) => (
          <ExperimentCard key={card.name} card={card} index={i} />
        ))}

        {/* --- Footer --- */}
        <div
          className="mt-auto pt-3 font-mono"
          style={{
            fontSize: 9,
            color: 'rgba(200,168,233,0.3)',
            borderTop: '1px solid rgba(188,19,254,0.15)',
            letterSpacing: '0.12em',
          }}
        >
          SUPABASE SYNC · PENDING ·{' '}
          <span style={{ color: '#FFE600' }}>LOCAL MODE</span>
        </div>
      </div>
    </PanelShell>
  )
}
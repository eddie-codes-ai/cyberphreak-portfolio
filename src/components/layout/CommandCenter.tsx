'use client'

// --- CommandCenter — full grid layout, global event listeners ---

import { useMouseSpeed } from '@/hooks/useMouseSpeed'
import { useKeyBuffer } from '@/hooks/useKeyBuffer'

import Header            from '@/components/layout/Header'
import NetworksPanel     from '@/components/panels/NetworksPanel'
import NetworkTree       from '@/components/panels/NetworkTree'
import CodePanel         from '@/components/panels/CodePanel'
import SecurityLab       from '@/components/panels/SecurityLab'
import ExperimentsPanel  from '@/components/panels/ExperimentsPanel'
import OSStatusWidget    from '@/components/panels/OSStatusWidget'
import GlitchEdges       from '@/components/effects/GlitchEdges'
import ScanlineOverlay   from '@/components/effects/ScanlineOverlay'
import VortexBackground  from '@/components/effects/VortexBackground'

export default function CommandCenter() {
  const mouseSpeed = useMouseSpeed()
  const keyBuffer  = useKeyBuffer()

  return (
    <>
      {/* --- Always-on background layers --- */}
      <VortexBackground />
      <ScanlineOverlay />
      <GlitchEdges />

      {/* --- Root shell --- */}
      <div
        className="relative flex flex-col w-screen h-screen overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* --- Header --- */}
        <Header />

        {/* --- Main grid --- */}
        <main
          className="flex-1 grid min-h-0 gap-2 p-2"
          style={{
            gridTemplateColumns: '260px 1fr 300px',
            gridTemplateRows:    '1fr 1fr',
          }}
        >
          {/* Row 1, Col 1 — Networks */}
          <NetworksPanel />

          {/* Col 2 spans both rows — Network Tree */}
          <div
            className="panel-glass overflow-hidden"
            style={{
              gridColumn: '2',
              gridRow:    '1 / 3',
            }}
          >
            <NetworkTree />
          </div>

          {/* Row 1, Col 3 — Code */}
          <CodePanel keyBuffer={keyBuffer} />

          {/* Row 2, Col 1 — Experiments */}
          <ExperimentsPanel />

          {/* Row 2, Col 3 — Security Lab */}
          <SecurityLab mouseSpeed={mouseSpeed} />
        </main>

        {/* --- Floating overlay --- */}
        <OSStatusWidget />
      </div>
    </>
  )
}
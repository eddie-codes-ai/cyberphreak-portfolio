'use client'

// --- CommandCenter — full grid layout, global event listeners ---

import { useState, useCallback } from 'react'
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

export type PanelId = 'networks' | 'code' | 'security' | 'experiments' | null

interface PanelWrapperProps {
  id: string
  active: boolean
  children: React.ReactNode
  style?: React.CSSProperties
}

function PanelWrapper({ id, active, children, style }: PanelWrapperProps) {
  return (
    <div
      id={id}
      style={{
        ...style,
        position: 'relative',
        transition: 'box-shadow 0.2s ease',
        boxShadow: active
          ? '0 0 0 2px #00FFE7, 0 0 32px rgba(0,255,231,0.4), inset 0 0 20px rgba(0,255,231,0.05)'
          : 'none',
        borderRadius: 2,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Cyan flash border overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 50,
          border: active ? '2px solid #00FFE7' : '2px solid transparent',
          transition: 'border-color 0.2s ease',
          borderRadius: 2,
        }}
      />
      {children}
    </div>
  )
}

export default function CommandCenter() {
  const mouseSpeed                    = useMouseSpeed()
  const keyBuffer                     = useKeyBuffer()
  const [activePanel, setActivePanel] = useState<PanelId>(null)

  const handleNavClick = useCallback((panelId: PanelId) => {
    setActivePanel(panelId)
    setTimeout(() => setActivePanel(null), 1200)
  }, [])

  return (
    <>
      {/* --- Always-on background layers --- */}
      <VortexBackground />
      <ScanlineOverlay />
      <GlitchEdges />

      {/* --- Root shell --- */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* --- Header — always visible, fixed height --- */}
        <div style={{ flexShrink: 0, zIndex: 20 }}>
          <Header onNavClick={handleNavClick} />
        </div>

        {/* --- Desktop grid --- */}
        <div
          className="desktop-grid"
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '260px 1fr 300px',
            gridTemplateRows: '1fr 1fr',
            gap: 8,
            padding: 8,
          }}
        >
          {/* Row 1 Col 1 — Networks */}
          <PanelWrapper id="networks" active={activePanel === 'networks'}>
            <NetworksPanel />
          </PanelWrapper>

          {/* Col 2 spans both rows — Network Tree */}
          <div
            className="panel-glass overflow-hidden"
            style={{ gridColumn: '2', gridRow: '1 / 3', minHeight: 0 }}
          >
            <NetworkTree />
          </div>

          {/* Row 1 Col 3 — Code */}
          <PanelWrapper id="code" active={activePanel === 'code'}>
            <CodePanel keyBuffer={keyBuffer} />
          </PanelWrapper>

          {/* Row 2 Col 1 — Experiments */}
          <PanelWrapper id="experiments" active={activePanel === 'experiments'}>
            <ExperimentsPanel />
          </PanelWrapper>

          {/* Row 2 Col 3 — Security Lab */}
          <PanelWrapper id="security" active={activePanel === 'security'}>
            <SecurityLab mouseSpeed={mouseSpeed} />
          </PanelWrapper>
        </div>

        {/* --- Mobile layout --- */}
        <div
          className="mobile-grid"
          style={{
            flex: 1,
            minHeight: 0,
            display: 'none',
            flexDirection: 'column',
            gap: 8,
            padding: 8,
            overflowY: 'auto',
          }}
        >
          <div style={{ height: 380, flexShrink: 0 }}>
            <NetworkTree />
          </div>
          <div style={{ height: 280, flexShrink: 0 }}>
            <NetworksPanel />
          </div>
          <div style={{ height: 320, flexShrink: 0 }}>
            <CodePanel keyBuffer={keyBuffer} />
          </div>
          <div style={{ height: 340, flexShrink: 0 }}>
            <SecurityLab mouseSpeed={mouseSpeed} />
          </div>
          <div style={{ height: 340, flexShrink: 0 }}>
            <ExperimentsPanel />
          </div>
        </div>

        {/* --- Floating overlay --- */}
        <OSStatusWidget />
      </div>

      {/* --- Responsive breakpoint styles --- */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-grid { display: none !important; }
          .mobile-grid  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
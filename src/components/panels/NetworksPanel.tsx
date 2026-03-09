'use client'

// --- NetworksPanel — streaming simulated packet logs ---

import { useEffect, useRef } from 'react'
import PanelShell from '@/components/ui/PanelShell'
import { usePacketLog } from '@/hooks/usePacketLog'
import { formatLogLine } from '@/lib/utils'

const RESULT_COLORS: Record<string, string> = {
  SUCCESS: '#00FF88',
  TIMEOUT: '#FFE600',
  RESET:   '#FF4444',
}

const PROTO_COLORS: Record<string, string> = {
  ICMP: '#BC13FE',
  TCP:  '#00FFE7',
  UDP:  '#FF00FF',
  ARP:  '#FFE600',
  DNS:  '#FF2D9B',
}

export default function NetworksPanel() {
  const logs      = usePacketLog()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new log
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const lineCount = String(logs.length).padStart(3, '0')

  return (
    <PanelShell
      title="NETWORKS"
      dotColor="#00FF88"
      titleRight={<span style={{ color: '#00FF88' }}>LIVE · {lineCount}</span>}
      className="h-full"
    >
      <div
        className="h-full overflow-y-auto px-3 py-2 flex flex-col gap-0.5"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}
      >
        {logs.map((log, i) => {
          const time = new Date(log.timestamp).toTimeString().slice(0, 8)
          return (
            <div
              key={`${log.timestamp}-${i}`}
              className="flex items-center gap-2 leading-5 whitespace-nowrap"
              style={{ opacity: 0.85 + (i / logs.length) * 0.15 }}
            >
              {/* Timestamp */}
              <span style={{ color: 'rgba(200,168,233,0.45)', minWidth: 64 }}>
                {time}
              </span>

              {/* Protocol badge */}
              <span
                className="px-1 font-bold"
                style={{
                  color: PROTO_COLORS[log.proto] ?? '#C8A8E9',
                  minWidth: 36,
                  textShadow: `0 0 6px ${PROTO_COLORS[log.proto] ?? '#C8A8E9'}`,
                }}
              >
                {log.proto}
              </span>

              {/* IP:PORT */}
              <span style={{ color: '#C8A8E9', minWidth: 140 }}>
                {log.ip}
                <span style={{ color: 'rgba(200,168,233,0.4)' }}>:</span>
                <span style={{ color: '#BC13FE' }}>{log.port}</span>
              </span>

              {/* Arrow */}
              <span style={{ color: 'rgba(188,19,254,0.4)' }}>→</span>

              {/* Result */}
              <span
                style={{
                  color: RESULT_COLORS[log.result] ?? '#C8A8E9',
                  fontWeight: 700,
                  textShadow: `0 0 8px ${RESULT_COLORS[log.result] ?? '#C8A8E9'}`,
                }}
              >
                {log.result}
              </span>
            </div>
          )
        })}

        {/* Blinking cursor at end */}
        <div className="flex items-center gap-1 mt-1">
          <span style={{ color: '#BC13FE' }}>▶</span>
          <span
            className="cursor-blink inline-block w-2 h-3"
            style={{ background: '#BC13FE' }}
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </PanelShell>
  )
}
'use client'

// --- CodePanel — XTerm.js terminal with keyboard injection ---
// Static fictional code shown on mount; live keystrokes append below line 14

import { useEffect, useRef } from 'react'
import PanelShell from '@/components/ui/PanelShell'

interface CodePanelProps {
  keyBuffer: string
}

// --- Fictional "surprise me" breach code ---
// Theme: spectral.ts — a ghost process that haunts the network stack
const STATIC_CODE = [
  { text: '// spectral.ts — unregistered daemon', color: '#C8A8E980' },
  { text: "import { phantom } from '@core/ghost'", color: '#00FFE7' },
  { text: "import { weave, unravel } from '@net/loom'", color: '#00FFE7' },
  { text: '', color: '' },
  { text: 'const HAUNT_INTERVAL = 1337 // ms', color: '#BC13FE' },
  { text: 'const TARGET_STACK   = process.env.PREY', color: '#BC13FE' },
  { text: '', color: '' },
  { text: 'async function spectral(host: string) {', color: '#FF00FF' },
  { text: '  const ghost  = await phantom.spawn(host)', color: '#C8A8E9' },
  { text: '  const thread = await weave(ghost.pid)', color: '#C8A8E9' },
  { text: '', color: '' },
  { text: '  while (thread.alive) {', color: '#FF2D9B' },
  { text: '    await ghost.phase(HAUNT_INTERVAL)', color: '#C8A8E9' },
  { text: '    // ↓ user keystrokes inject below:', color: '#C8A8E940' },
]

export default function CodePanel({ keyBuffer }: CodePanelProps) {
  const termRef     = useRef<HTMLDivElement>(null)
  const xtermRef    = useRef<import('xterm').Terminal | null>(null)
  const fitRef      = useRef<import('xterm-addon-fit').FitAddon | null>(null)
  const injectedRef = useRef<string>('')

  useEffect(() => {
    // Dynamically import xterm to avoid SSR issues
    let destroyed = false

    async function init() {
      const { Terminal }  = await import('xterm')
      const { FitAddon }  = await import('xterm-addon-fit')

      if (destroyed || !termRef.current) return

      const term = new Terminal({
        theme: {
          background:  '#0a0314',
          foreground:  '#C8A8E9',
          cursor:      '#BC13FE',
          cursorAccent:'#0a0314',
          black:       '#0a0314',
          brightBlack: '#3d2060',
        },
        fontFamily:   'Share Tech Mono, monospace',
        fontSize:     12,
        lineHeight:   1.45,
        cursorBlink:  true,
        cursorStyle:  'block',
        disableStdin: true,
        scrollback:   200,
      })

      const fit = new FitAddon()
      term.loadAddon(fit)
      term.open(termRef.current)

      // Small delay to let DOM settle before fitting
      setTimeout(() => {
        fit.fit()
      }, 80)

      xtermRef.current = term
      fitRef.current   = fit

      // Write static code lines
      for (const line of STATIC_CODE) {
        if (!line.text) {
          term.writeln('')
          continue
        }
        // Inline ANSI colouring via escape codes
        const ansi = hexToAnsi(line.color || '#C8A8E9')
        term.writeln(`${ansi}${line.text}\x1b[0m`)
      }

      // Prompt line
      term.write('\x1b[38;2;188;19;254m    \x1b[38;2;0;255;231m▶ \x1b[0m')
    }

    init()

    const ro = new ResizeObserver(() => {
      fitRef.current?.fit()
    })
    if (termRef.current) ro.observe(termRef.current)

    return () => {
      destroyed = true
      ro.disconnect()
      xtermRef.current?.dispose()
      xtermRef.current = null
    }
  }, [])

  // --- Inject new keystrokes ---
  useEffect(() => {
    const term = xtermRef.current
    if (!term) return

    const prev = injectedRef.current
    const next = keyBuffer

    if (next.length > prev.length) {
      const newChars = next.slice(prev.length)
      for (const ch of newChars) {
        if (ch === 'Backspace') {
          term.write('\b \b')
        } else if (ch === 'Enter') {
          term.writeln('')
          term.write('\x1b[38;2;188;19;254m    \x1b[38;2;0;255;231m▶ \x1b[0m')
        } else if (ch.length === 1) {
          term.write(`\x1b[38;2;255;0;255m${ch}\x1b[0m`)
        }
      }
      injectedRef.current = next
    } else if (next.length < prev.length) {
      // Buffer was reset
      injectedRef.current = next
    }
  }, [keyBuffer])

  return (
    <PanelShell
      title="CODE"
      dotColor="#FF00FF"
      titleRight={
        <span style={{ color: '#FF00FF', fontSize: 10 }}>
          spectral.ts · TypeScript
        </span>
      }
      className="h-full"
    >
      <div
        ref={termRef}
        className="w-full h-full"
        style={{ background: '#0a0314' }}
      />
    </PanelShell>
  )
}

// --- Hex color → ANSI 24-bit escape ---
function hexToAnsi(hex: string): string {
  const clean = hex.replace('#', '').slice(0, 6)
  if (clean.length < 6) return '\x1b[0m'
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `\x1b[38;2;${r};${g};${b}m`
}
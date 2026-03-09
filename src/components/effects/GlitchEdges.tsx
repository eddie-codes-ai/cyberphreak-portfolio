'use client'

// --- GlitchEdges — GSAP animated left/right screen edge tracers ---

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const COLORS = ['#BC13FE', '#FF00FF', '#00FFE7', '#FF2D9B']

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

interface EdgeProps {
  side: 'left' | 'right'
}

function GlitchEdge({ side }: EdgeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Build 6 stacked segments per edge
    const segments = Array.from(el.querySelectorAll<HTMLDivElement>('.seg'))

    const tl = gsap.timeline({ repeat: -1 })

    function buildCycle() {
      tl.clear()
      segments.forEach((seg, i) => {
        const delay = i * 0.07 + Math.random() * 0.1
        tl.to(
          seg,
          {
            opacity: Math.random() > 0.3 ? 0.9 : 0.15,
            y: (Math.random() - 0.5) * 14,
            scaleY: 0.7 + Math.random() * 0.6,
            backgroundColor: pickColor(),
            boxShadow: `0 0 6px ${pickColor()}, 0 0 12px ${pickColor()}`,
            duration: 0.08 + Math.random() * 0.12,
            ease: 'steps(1)',
          },
          delay
        )
      })
      tl.to({}, { duration: 0.3 + Math.random() * 0.4 }) // pause between glitches
    }

    buildCycle()
    // Re-randomise every few loops
    const interval = setInterval(buildCycle, 2200)
    return () => {
      clearInterval(interval)
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 bottom-0 z-50 flex flex-col pointer-events-none"
      style={{ [side]: 0, width: 3 }}
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="seg flex-1"
          style={{
            background: COLORS[i % COLORS.length],
            opacity: 0.4,
            boxShadow: `0 0 4px ${COLORS[i % COLORS.length]}`,
          }}
        />
      ))}
    </div>
  )
}

export default function GlitchEdges() {
  return (
    <>
      <GlitchEdge side="left" />
      <GlitchEdge side="right" />
    </>
  )
}
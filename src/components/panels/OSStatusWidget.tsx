'use client'

// --- OSStatusWidget — floating draggable system panel ---

import { useRef, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useUptime } from '@/hooks/useUptime'
import { OS_NAME, ACTIVE_NODES_COUNT } from '@/lib/constants'
import ContactModal from '@/components/ui/ContactModal'

// --- Mini world map dots (approximate lat/lon → canvas x/y) ---
const MAP_DOTS = [
  { x: 0.22, y: 0.38, label: 'NYC' },
  { x: 0.48, y: 0.32, label: 'LON' },
  { x: 0.55, y: 0.28, label: 'AMS' },
  { x: 0.72, y: 0.42, label: 'SIN' },
  { x: 0.82, y: 0.55, label: 'SYD' },
  { x: 0.14, y: 0.52, label: 'LAX' },
  { x: 0.50, y: 0.48, label: 'JNB' },
]

function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const W = canvas.width
      const H = canvas.height

      // Grid lines
      ctx.strokeStyle = 'rgba(188,19,254,0.12)'
      ctx.lineWidth = 0.5
      for (let i = 1; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(0, (H / 4) * i)
        ctx.lineTo(W, (H / 4) * i)
        ctx.stroke()
      }
      for (let i = 1; i < 6; i++) {
        ctx.beginPath()
        ctx.moveTo((W / 6) * i, 0)
        ctx.lineTo((W / 6) * i, H)
        ctx.stroke()
      }

      // Pulsing location dots
      for (const dot of MAP_DOTS) {
        const x = dot.x * W
        const y = dot.y * H
        const pulse = Math.sin(t * 0.05 + dot.x * 10) * 0.5 + 0.5

        ctx.beginPath()
        ctx.arc(x, y, 4 + pulse * 3, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,255,231,${0.2 + pulse * 0.3})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,231,${0.7 + pulse * 0.3})`
        ctx.fill()

        ctx.fillStyle = `rgba(0,255,231,0.5)`
        ctx.font = '7px Share Tech Mono, monospace'
        ctx.fillText(dot.label, x + 4, y - 3)
      }

      // Sweeping scan line
      const scanX = (t * 0.8) % W
      const scanGrad = ctx.createLinearGradient(scanX - 20, 0, scanX, 0)
      scanGrad.addColorStop(0, 'transparent')
      scanGrad.addColorStop(1, 'rgba(0,255,231,0.06)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(scanX - 20, 0, 20, H)

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={90}
      className="w-full"
      style={{ height: 90, display: 'block' }}
    />
  )
}

export default function OSStatusWidget() {
  const uptime = useUptime()
  const [showContact, setShowContact] = useState(false)

  return (
    <>
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 select-none"
      style={{
        zIndex: 200,
        width: 240,
        background: 'rgba(15,5,29,0.92)',
        border: '1px solid rgba(188,19,254,0.5)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 24px rgba(188,19,254,0.2), inset 0 0 40px rgba(188,19,254,0.03)',
        cursor: 'grab',
      }}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
    >
      {/* --- Title bar --- */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid rgba(188,19,254,0.2)' }}
      >
        <div className="flex items-center gap-1.5">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
            <span
              key={i}
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: c, opacity: 0.8 }}
            />
          ))}
        </div>
        <span
          className="font-mono text-center"
          style={{ fontSize: 9, color: '#BC13FE', letterSpacing: '0.15em' }}
        >
          {OS_NAME}
        </span>
        <span className="font-mono" style={{ fontSize: 9, color: 'rgba(200,168,233,0.3)' }}>
          ●
        </span>
      </div>

      {/* --- Body --- */}
      <div className="flex flex-col gap-3 p-3">
        {/* Uptime */}
        <div className="flex items-center justify-between">
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.15em' }}>
            UPTIME
          </span>
          <span className="font-retro" style={{ fontSize: 18, color: '#00FFE7', textShadow: '0 0 8px #00FFE7' }}>
            {uptime}
          </span>
        </div>

        {/* Active nodes */}
        <div className="flex items-center justify-between">
          <span className="font-mono" style={{ fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.15em' }}>
            ACTIVE NODES
          </span>
          <span className="font-retro" style={{ fontSize: 18, color: '#BC13FE', textShadow: '0 0 8px #BC13FE' }}>
            {ACTIVE_NODES_COUNT}
          </span>
        </div>

        {/* World map */}
        <div style={{ border: '1px solid rgba(188,19,254,0.2)', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
          <div
            className="px-2 py-1 font-mono"
            style={{ fontSize: 8, color: 'rgba(0,255,231,0.4)', borderBottom: '1px solid rgba(188,19,254,0.15)', letterSpacing: '0.15em' }}
          >
            GLOBAL NODES
          </div>
          <WorldMap />
        </div>

        {/* Contact button */}
        <button
          onClick={() => setShowContact(true)}
          className="block w-full text-center font-mono py-2 transition-all duration-150"
          style={{
            fontSize: 10,
            color: '#00FFE7',
            background: 'rgba(0,255,231,0.06)',
            border: '1px solid rgba(0,255,231,0.3)',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            width: '100%',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.background = 'rgba(0,255,231,0.15)'
            el.style.boxShadow  = '0 0 12px rgba(0,255,231,0.3)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.background = 'rgba(0,255,231,0.06)'
            el.style.boxShadow  = 'none'
          }}
        >
          ▶ CONTACT
        </button>
      </div>
    </motion.div>

    {/* Contact modal — outside motion.div so it covers full screen */}
    {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  )
}
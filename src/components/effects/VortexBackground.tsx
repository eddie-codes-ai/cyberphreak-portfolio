'use client'

// --- VortexBackground — canvas spiral that always runs behind everything ---

import { useEffect, useRef } from 'react'

export default function VortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    function resize() {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // --- Particle ring config ---
    const RINGS    = 5
    const PER_RING = 60
    const CX       = () => canvas!.width  / 2
    const CY       = () => canvas!.height / 2

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let r = 0; r < RINGS; r++) {
        const baseRadius = 80 + r * 90
        const speed      = 0.0004 + r * 0.00015
        const spread     = 18 + r * 6

        for (let p = 0; p < PER_RING; p++) {
          const angle   = (p / PER_RING) * Math.PI * 2 + t * speed * (r % 2 === 0 ? 1 : -1)
          const wobble  = Math.sin(t * 0.8 + r * 1.3 + p * 0.2) * spread
          const radius  = baseRadius + wobble
          const x       = CX() + Math.cos(angle) * radius
          const y       = CY() + Math.sin(angle) * radius

          // Colour cycling: violet → pink → cyan
          const hue     = ((t * 0.05 + r * 40 + p * 2) % 360)
          // Map hue to our palette — keep it in 260–300 (violet) and 180 (cyan) zones
          const pct     = (p / PER_RING)
          let color: string
          if (pct < 0.33) {
            color = `rgba(188,19,254,${0.15 + 0.1 * Math.sin(t + p)})`
          } else if (pct < 0.66) {
            color = `rgba(0,255,231,${0.1 + 0.08 * Math.cos(t + p)})`
          } else {
            color = `rgba(255,0,255,${0.12 + 0.07 * Math.sin(t * 1.2 + p)})`
          }

          const size = 1 + Math.sin(t * 0.5 + p * 0.3 + r) * 0.8

          ctx.beginPath()
          ctx.arc(x, y, Math.max(0.2, size), 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      // Subtle radial glow at center
      const grad = ctx.createRadialGradient(CX(), CY(), 0, CX(), CY(), 260)
      grad.addColorStop(0,   'rgba(188,19,254,0.06)')
      grad.addColorStop(0.5, 'rgba(0,255,231,0.03)')
      grad.addColorStop(1,   'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      t += 1
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
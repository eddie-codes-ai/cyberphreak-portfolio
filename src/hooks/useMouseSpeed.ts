import { useState, useEffect, useRef } from 'react'
import { clamp } from '@/lib/utils'

export function useMouseSpeed(): number {
  const [speed, setSpeed] = useState(0)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const speedRef = useRef(0)

  useEffect(() => {
    // --- decay loop: speed fades when mouse is idle ---
    const decay = setInterval(() => {
      speedRef.current = speedRef.current * 0.92
      setSpeed(Math.round(speedRef.current))
    }, 50)

    const handleMove = (e: MouseEvent) => {
      if (!lastPos.current) {
        lastPos.current = { x: e.clientX, y: e.clientY }
        return
      }

      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const delta = Math.sqrt(dx * dx + dy * dy)

      speedRef.current = clamp(speedRef.current + delta * 0.4, 0, 100)
      setSpeed(Math.round(speedRef.current))

      lastPos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      clearInterval(decay)
    }
  }, [])

  return speed
}
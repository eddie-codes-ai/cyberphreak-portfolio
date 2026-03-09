import { useState, useEffect } from 'react'

const MAX_BUFFER_LENGTH = 30

export function useKeyBuffer(): string {
  const [buffer, setBuffer] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // --- ignore modifier-only keys ---
      if (e.ctrlKey || e.altKey || e.metaKey) return

      if (e.key === 'Backspace') {
        setBuffer(prev => prev.slice(0, -1))
        return
      }

      if (e.key === 'Enter') {
        setBuffer('')
        return
      }

      if (e.key.length === 1) {
        setBuffer(prev => {
          const next = prev + e.key
          return next.length > MAX_BUFFER_LENGTH ? next.slice(-MAX_BUFFER_LENGTH) : next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return buffer
}
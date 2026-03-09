import { useState, useEffect } from 'react'
import { formatUptime } from '@/lib/utils'

export function useUptime(): string {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return formatUptime(seconds)
}
import { useState, useEffect } from 'react'
import { generateLogLine } from '@/lib/utils'
import { LOG_INTERVAL_MS, MAX_LOG_LINES } from '@/lib/constants'
import type { LogLine } from '@/lib/types'

export function usePacketLog(): LogLine[] {
  const [logs, setLogs] = useState<LogLine[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, generateLogLine()]
        return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next
      })
    }, LOG_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return logs
}
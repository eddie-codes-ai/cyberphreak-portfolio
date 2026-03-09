import { useState, useEffect } from 'react'
import { randomInRange } from '@/lib/utils'
import type { SystemMetrics } from '@/lib/types'
import { METRICS_INTERVAL_MS } from '@/lib/constants'

function generateMetrics(): SystemMetrics {
  return {
    cpu:  `${Math.floor(randomInRange(20, 85))}%`,
    mem:  `${randomInRange(4, 12).toFixed(1)}G`,
    pkt:  `${randomInRange(0.5, 3.5).toFixed(1)}K`,
    sess: `${Math.floor(randomInRange(8, 32))}`,
  }
}

export function useMetrics(): SystemMetrics {
  const [metrics, setMetrics] = useState<SystemMetrics>(generateMetrics())

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMetrics())
    }, METRICS_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return metrics
}
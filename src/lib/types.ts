// --- Shared Types ---

export type LogLine = {
  proto: 'ICMP' | 'TCP' | 'UDP' | 'ARP' | 'DNS'
  ip: string
  port: number
  result: 'SUCCESS' | 'TIMEOUT' | 'RESET'
  timestamp: number
}

export type NetworkNode = {
  id: string
  label: string
  active: boolean
  position: { x: number; y: number }
}

export type Ripple = {
  x: number
  y: number
  radius: number
  alpha: number
  nodeId: string
}

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// Updated to match constants.ts shape
export type ThreatConfig = {
  label: ThreatLevel
  color: string
  threshold: number
}

export type ExperimentCard = {
  id: string
  name: string
  language: string
  status: 'ACTIVE' | 'BETA' | 'LOCKED'
  description?: string
}

export type PanelConfig = {
  id: string
  title: string
  hasBrackets: boolean
}

export type Metric = {
  label: string
  value: string
  unit: string
}

// --- SystemMetrics (used by useMetrics hook) ---
export type SystemMetrics = {
  cpu:  string
  mem:  string
  pkt:  string
  sess: string
}
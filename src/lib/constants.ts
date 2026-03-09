import type { ThreatConfig, ExperimentCard, PanelConfig } from './types'

// --- COLOR PALETTE ---
export const COLORS = {
  bg: '#0F051D',
  violet: '#BC13FE',
  pink: '#FF00FF',
  pinkAlt: '#FF2D9B',
  cyan: '#00FFE7',
  threatRed: '#FF4444',
  yellow: '#FFE600',
  panel: 'rgba(26, 26, 27, 0.85)',
  border: 'rgba(188, 19, 254, 0.4)',
  text: '#C8A8E9',
  green: '#00FF88',
} as const

// --- THREAT LEVELS ---
export const THREAT_CONFIGS: ThreatConfig[] = [
  { label: 'LOW',      color: '#00FF88', threshold: 0  },
  { label: 'MEDIUM',   color: '#FFE600', threshold: 25 },
  { label: 'HIGH',     color: '#FF4444', threshold: 50 },
  { label: 'CRITICAL', color: '#FF0000', threshold: 75 },
]

export function getThreatConfig(pct: number): ThreatConfig {
  const sorted = [...THREAT_CONFIGS].reverse()
  return sorted.find(c => pct >= c.threshold) ?? THREAT_CONFIGS[0]
}

export function getThreatLevel(pct: number): ThreatConfig['label'] {
  return getThreatConfig(pct).label
}

// --- NETWORK NODES ---
export const PROTOCOL_NODES = [
  'SMTP', 'DNS', 'HTTP', 'FTP', 'SSH',
  'IMAP', 'SNMP', 'DHCP', 'TFTP', 'RDP', 'IRC', 'TELNET',
]

// Both names exported so utils.ts and hooks can import either
export const PACKET_PROTOS  = ['ICMP', 'TCP', 'UDP', 'ARP', 'DNS'] as const
export const LOG_PROTOS      = PACKET_PROTOS

export const PACKET_RESULTS = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'TIMEOUT', 'RESET'] as const
export const LOG_RESULTS     = PACKET_RESULTS

export const SAMPLE_IPS = [
  '10.0.0.1', '192.168.1.1', '172.16.0.5',
  '10.10.1.33', '192.168.0.254', '10.0.0.255',
]

// --- STATUS DOT COLORS ---
export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#00FF88',
  BETA:   '#FFE600',
  LOCKED: '#FF2D9B',
}

// --- EXPERIMENTS ---
export const DEFAULT_EXPERIMENTS: ExperimentCard[] = [
  { id: '1', name: 'PACKET SNIFFER', language: 'Python', status: 'ACTIVE',  description: 'Real-time packet capture and analysis' },
  { id: '2', name: 'DNS TUNNEL',     language: 'C++',    status: 'BETA',    description: 'Covert data exfiltration via DNS' },
  { id: '3', name: 'ARP SPOOF',      language: 'Rust',   status: 'ACTIVE',  description: 'Network layer MITM tool' },
  { id: '4', name: 'ZERO-DAY LAB',   language: 'ASM',    status: 'LOCKED',  description: 'Classified. Access denied.' },
]

// --- PANELS ---
export const PANELS: PanelConfig[] = [
  { id: 'networks',     title: 'NETWORKS',     hasBrackets: true  },
  { id: 'network-tree', title: 'NETWORK TREE', hasBrackets: false },
  { id: 'code',         title: 'CODE',         hasBrackets: true  },
  { id: 'security',     title: 'SECURITY LAB', hasBrackets: true  },
  { id: 'experiments',  title: 'EXPERIMENTS',  hasBrackets: true  },
]

// --- TIMING ---
export const LOG_INTERVAL_MS     = 400
export const METRICS_INTERVAL_MS = 2000
export const MAX_LOG_LINES       = 20

// --- OS STATUS ---
export const OS_NAME            = 'PHREAK/OS v4.2.1'
export const ACTIVE_NODES_COUNT = 12
export const CONTACT_EMAIL      = 'hello@chaoticreative.dev'

// --- METRIC LABELS ---
export const METRIC_LABELS = ['CPU', 'MEM', 'PKT/S', 'SESS'] as const
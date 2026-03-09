// --- Default React Flow nodes and edges for NetworkTree ---

import type { Node, Edge } from '@xyflow/react'

const PROTOCOLS = [
  'SMTP', 'DNS', 'HTTP', 'FTP', 'SSH',
  'IMAP', 'SNMP', 'DHCP', 'TFTP', 'RDP', 'IRC', 'TELNET',
]

const RADIUS = 220

export const initialNodes: Node[] = [
  {
    id: 'CORE',
    type: 'default',
    position: { x: 0, y: 0 },
    data: { label: 'CORE' },
    draggable: false,
  },
  ...PROTOCOLS.map((proto, i) => {
    const angle = (i / PROTOCOLS.length) * 2 * Math.PI - Math.PI / 2
    return {
      id: proto,
      type: 'default',
      position: {
        x: Math.cos(angle) * RADIUS,
        y: Math.sin(angle) * RADIUS,
      },
      data: { label: proto },
      draggable: false,
    } satisfies Node
  }),
]

export const initialEdges: Edge[] = PROTOCOLS.map((proto) => ({
  id: `CORE-${proto}`,
  source: 'CORE',
  target: proto,
  type: 'default',
  animated: false,
}))

// Keep defaultNodes/defaultEdges as aliases for any file still using old names
export const defaultNodes = initialNodes
export const defaultEdges = initialEdges
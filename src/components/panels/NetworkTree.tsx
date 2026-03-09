'use client'

// --- NetworkTree — React Flow interactive node diagram + canvas packet animation ---

import { useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { defaultNodes, defaultEdges } from '@/lib/network-data'
import type { Ripple } from '@/lib/types'

// --- Packet dot travelling along an edge ---
interface PacketDot {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  progress: number
  speed: number
  color: string
}

const PACKET_COLORS = ['#BC13FE', '#00FFE7', '#FF00FF', '#00FF88', '#FFE600']

function randomPacketColor() {
  return PACKET_COLORS[Math.floor(Math.random() * PACKET_COLORS.length)]
}

export default function NetworkTree() {
  const [nodes, , onNodesChange] = useNodesState(defaultNodes)
  const [edges, , onEdgesChange] = useEdgesState(defaultEdges)

  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const packetsRef = useRef<PacketDot[]>([])
  const animIdRef  = useRef<number>(0)

  // --- Spawn packet dots on random edges ---
  useEffect(() => {
    const interval = setInterval(() => {
      const edge    = defaultEdges[Math.floor(Math.random() * defaultEdges.length)]
      const srcNode = defaultNodes.find(n => n.id === edge.source)
      const tgtNode = defaultNodes.find(n => n.id === edge.target)
      if (!srcNode || !tgtNode) return

      packetsRef.current.push({
        id:      `${Date.now()}-${Math.random()}`,
        sourceX: srcNode.position.x,
        sourceY: srcNode.position.y,
        targetX: tgtNode.position.x,
        targetY: tgtNode.position.y,
        progress: 0,
        speed:   0.008 + Math.random() * 0.012,
        color:   randomPacketColor(),
      })

      if (packetsRef.current.length > 40) {
        packetsRef.current = packetsRef.current.slice(-40)
      }
    }, 600)
    return () => clearInterval(interval)
  }, [])

  // --- Canvas animation loop ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function toCanvas(x: number, y: number) {
      return {
        x: canvas!.width  / 2 + x,
        y: canvas!.height / 2 + y,
      }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ripples
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0.01)
      for (const r of ripplesRef.current) {
        const pos = toCanvas(r.x, r.y)
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(188,19,254,${r.alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        r.radius += 3
        r.alpha  *= 0.93
      }

      // Draw packet dots
      packetsRef.current = packetsRef.current.filter(p => p.progress < 1)
      for (const p of packetsRef.current) {
        p.progress = Math.min(1, p.progress + p.speed)
        const src = toCanvas(p.sourceX, p.sourceY)
        const tgt = toCanvas(p.targetX, p.targetY)
        const cpX = (src.x + tgt.x) / 2 + (tgt.y - src.y) * 0.2
        const cpY = (src.y + tgt.y) / 2 - (tgt.x - src.x) * 0.2
        const t   = p.progress
        const x   = (1-t)*(1-t)*src.x + 2*(1-t)*t*cpX + t*t*tgt.x
        const y   = (1-t)*(1-t)*src.y + 2*(1-t)*t*cpY + t*t*tgt.y

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 6)
        grad.addColorStop(0,   p.color)
        grad.addColorStop(0.4, p.color + '99')
        grad.addColorStop(1,   'transparent')
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      animIdRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animIdRef.current)
      ro.disconnect()
    }
  }, [])

  // --- Node click → ripple burst ---
  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    for (let i = 0; i < 3; i++) {
      ripplesRef.current.push({
        x:      node.position.x,
        y:      node.position.y,
        radius: 10 + i * 18,
        alpha:  0.9 - i * 0.25,
        nodeId: node.id,
      })
    }
  }, [])

  return (
    <div className="relative w-full h-full" style={{ background: 'transparent' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        style={{ background: 'transparent' }}
      >
        <Background color="#BC13FE" gap={32} size={0.5} style={{ opacity: 0.08 }} />
      </ReactFlow>

      {/* Canvas overlay — packet dots + ripples */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', zIndex: 10 }}
      />

      <div
        className="absolute top-3 left-3 font-display text-xs tracking-widest pointer-events-none"
        style={{ color: '#BC13FE', opacity: 0.5, letterSpacing: '0.2em', zIndex: 20 }}
      >
        NETWORK TREE
      </div>
      <div
        className="absolute bottom-3 right-3 font-mono text-xs pointer-events-none"
        style={{ color: 'rgba(0,255,231,0.4)', zIndex: 20 }}
      >
        NODES: 13 · EDGES: 12
      </div>
    </div>
  )
}
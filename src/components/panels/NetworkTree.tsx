'use client'

// --- NetworkTree — Personal skill map for eddie-codes-ai ---

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  type NodeProps,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { Ripple } from '@/lib/types'

// -----------------------------------------------------------
// SKILL DATA — 12 nodes around CORE
// -----------------------------------------------------------
type SkillCategory = 'language' | 'network' | 'tool'
type Proficiency   = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

interface SkillData {
  label:       string
  category:    SkillCategory
  proficiency: Proficiency
  years:       number
  description: string
}

const SKILLS: Record<string, SkillData> = {
  PYTHON:      { label: 'Python',      category: 'language', proficiency: 'EXPERT',       years: 3, description: 'Scripting, automation, network tools & security research.' },
  JAVA:        { label: 'Java',        category: 'language', proficiency: 'ADVANCED',     years: 3, description: 'Backend systems, OOP architecture & Android fundamentals.' },
  DART:        { label: 'Dart',        category: 'language', proficiency: 'INTERMEDIATE', years: 2, description: 'Flutter mobile development, cross-platform apps.' },
  TYPESCRIPT:  { label: 'TypeScript',  category: 'language', proficiency: 'ADVANCED',     years: 2, description: 'Full-stack web development, type-safe systems.' },
  NMAP:        { label: 'Nmap',        category: 'network',  proficiency: 'EXPERT',       years: 3, description: 'Network scanning, host discovery & port enumeration.' },
  WIRESHARK:   { label: 'Wireshark',   category: 'network',  proficiency: 'ADVANCED',     years: 3, description: 'Packet capture, protocol analysis & traffic inspection.' },
  METASPLOIT:  { label: 'Metasploit',  category: 'network',  proficiency: 'INTERMEDIATE', years: 2, description: 'Exploitation framework for penetration testing.' },
  BURPSUITE:   { label: 'Burp Suite',  category: 'network',  proficiency: 'INTERMEDIATE', years: 2, description: 'Web app security testing & vulnerability scanning.' },
  DOCKER:      { label: 'Docker',      category: 'tool',     proficiency: 'ADVANCED',     years: 2, description: 'Containerisation, microservices & isolated lab envs.' },
  GIT:         { label: 'Git',         category: 'tool',     proficiency: 'EXPERT',       years: 3, description: 'Version control, branching strategies & collaboration.' },
  LINUX:       { label: 'Linux',       category: 'tool',     proficiency: 'EXPERT',       years: 3, description: 'Kali, Ubuntu & Arch — daily driver for dev and sec work.' },
  KUBERNETES:  { label: 'Kubernetes',  category: 'tool',     proficiency: 'INTERMEDIATE', years: 1, description: 'Container orchestration & cluster management.' },
}

// Category colors
const CATEGORY_COLOR: Record<SkillCategory, string> = {
  language: '#00FFE7',
  network:  '#FF00FF',
  tool:     '#FFE600',
}

// Proficiency → bar width %
const PROF_WIDTH: Record<Proficiency, number> = {
  BEGINNER:     25,
  INTERMEDIATE: 50,
  ADVANCED:     75,
  EXPERT:       100,
}

const PROF_COLOR: Record<Proficiency, string> = {
  BEGINNER:     '#FFE600',
  INTERMEDIATE: '#00FFE7',
  ADVANCED:     '#BC13FE',
  EXPERT:       '#00FF88',
}

// Node size by proficiency
const PROF_SIZE: Record<Proficiency, number> = {
  BEGINNER:     82,
  INTERMEDIATE: 92,
  ADVANCED:     104,
  EXPERT:       114,
}

// Pulse speed by proficiency
const PROF_PULSE: Record<Proficiency, string> = {
  BEGINNER:     '3.2s',
  INTERMEDIATE: '2.4s',
  ADVANCED:     '1.8s',
  EXPERT:       '1.2s',
}

// Node positions — clock layout
const RADIUS = 230
const NODE_IDS = Object.keys(SKILLS)
function getPosition(i: number) {
  const angle = (i / NODE_IDS.length) * Math.PI * 2 - Math.PI / 2
  return { x: Math.cos(angle) * RADIUS, y: Math.sin(angle) * RADIUS }
}

// -----------------------------------------------------------
// TOOLTIP COMPONENT
// -----------------------------------------------------------
interface TooltipProps {
  skill: SkillData
  onClose: () => void
  x: number
  y: number
}

function SkillTooltip({ skill, onClose, x, y }: TooltipProps) {
  const color   = CATEGORY_COLOR[skill.category]
  const profPct = PROF_WIDTH[skill.proficiency]
  const profCol = PROF_COLOR[skill.proficiency]

  // Keep tooltip inside viewport
  const left = Math.min(x, window.innerWidth  - 260)
  const top  = Math.min(y, window.innerHeight - 180)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        left,
        top,
        width: 240,
        background: 'rgba(15,5,29,0.97)',
        border: `1px solid ${color}`,
        boxShadow: `0 0 24px ${color}40, 0 0 48px ${color}20`,
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        padding: '12px 14px',
        cursor: 'pointer',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 700,
          color,
          letterSpacing: '0.2em',
          textShadow: `0 0 8px ${color}`,
        }}>
          {skill.label.toUpperCase()}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          color: `${color}80`,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          {skill.category}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'rgba(200,168,233,0.7)',
        lineHeight: 1.6,
        marginBottom: 12,
      }}>
        {skill.description}
      </p>

      {/* Proficiency bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.15em' }}>
            PROFICIENCY
          </span>
          <span style={{ fontFamily: 'var(--font-retro)', fontSize: 13, color: profCol, textShadow: `0 0 6px ${profCol}` }}>
            {skill.proficiency}
          </span>
        </div>
        <div style={{ width: '100%', height: 4, background: 'rgba(188,19,254,0.15)', position: 'relative' }}>
          <div style={{
            width: `${profPct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${profCol}60, ${profCol})`,
            boxShadow: `0 0 6px ${profCol}`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Years */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.15em' }}>
          EXPERIENCE
        </span>
        <span style={{ fontFamily: 'var(--font-retro)', fontSize: 16, color, textShadow: `0 0 8px ${color}` }}>
          {skill.years} YR{skill.years !== 1 ? 'S' : ''}
        </span>
      </div>

      {/* Dismiss hint */}
      <div style={{ marginTop: 10, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(200,168,233,0.25)', letterSpacing: '0.1em' }}>
        CLICK TO DISMISS
      </div>
    </div>
  )
}

// -----------------------------------------------------------
// CORE NODE — eddie-codes-ai
// -----------------------------------------------------------
interface CoreNodeProps extends NodeProps {
  data: { onCoreClick?: () => void }
}

function CoreNode({ data }: CoreNodeProps) {
  return (
    <>
      <style>{`
        @keyframes coreBreath {
          0%,100% { box-shadow: 0 0 20px 4px rgba(0,255,231,0.7), 0 0 60px 10px rgba(0,255,231,0.3), inset 0 0 20px rgba(0,255,231,0.15); }
          50%      { box-shadow: 0 0 40px 10px rgba(0,255,231,1), 0 0 100px 24px rgba(0,255,231,0.5), inset 0 0 40px rgba(0,255,231,0.3); }
        }
        @keyframes coreRingPulse {
          0%,100% { transform: scale(1);    opacity: 0.4; }
          50%     { transform: scale(1.15); opacity: 0.1; }
        }
        @keyframes coreSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <div
        onClick={data.onCoreClick}
        style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, rgba(0,255,231,0.35), rgba(0,255,231,0.04) 70%)',
          border: '2px solid #00FFE7',
          animation: 'coreBreath 2s ease-in-out infinite',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1px dashed rgba(0,255,231,0.3)', animation: 'coreSpin 8s linear infinite' }} />
        <div style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: '1px solid rgba(0,255,231,0.4)', animation: 'coreRingPulse 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 900, color: '#00FFE7', letterSpacing: '0.18em', textShadow: '0 0 10px #00FFE7', lineHeight: 1.3 }}>
          eddie
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 900, color: '#BC13FE', letterSpacing: '0.12em', textShadow: '0 0 10px #BC13FE', lineHeight: 1.3 }}>
          codes-ai
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'rgba(0,255,231,0.5)', letterSpacing: '0.1em', marginTop: 3 }}>
          TAP FOR BIO
        </span>
      </div>
    </>
  )
}

// -----------------------------------------------------------
// PROTOCOL NODE — skill diamond
// -----------------------------------------------------------
function ProtocolNode({ data, selected }: NodeProps) {
  const id       = data.id as string
  const skill    = SKILLS[id]
  if (!skill) return null

  const color    = CATEGORY_COLOR[skill.category]
  const size     = PROF_SIZE[skill.proficiency]
  const speed    = PROF_PULSE[skill.proficiency]
  const animName = `pulse_${id}`

  const keyframes = `
    @keyframes ${animName} {
      0%,100% { box-shadow: 0 0 8px 2px ${color}55, inset 0 0 8px ${color}10; border-color: ${color}60; }
      50%     { box-shadow: 0 0 22px 6px ${color}99, inset 0 0 16px ${color}25; border-color: ${color}; }
    }
  `

  return (
    <>
      <style>{keyframes}</style>
      <div style={{
        width: size, height: size,
        transform: 'rotate(45deg)',
        background: selected ? `${color}22` : 'rgba(15,5,29,0.92)',
        border: `1px solid ${selected ? color : `${color}60`}`,
        boxShadow: selected ? `0 0 28px 8px ${color}cc, inset 0 0 20px ${color}30` : undefined,
        animation: selected ? 'none' : `${animName} ${speed} ease-in-out infinite`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}>
        {/* Corner dots */}
        {[
          { top: -4, left: '50%', transform: 'translateX(-50%)' },
          { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
          { left: -4, top: '50%', transform: 'translateY(-50%)' },
          { right: -4, top: '50%', transform: 'translateY(-50%)' },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: selected ? color : `${color}99`,
            boxShadow: `0 0 5px ${color}80`,
            ...pos,
          }} />
        ))}

        {/* Label */}
        <span style={{
          transform: 'rotate(-45deg)',
          fontFamily: 'var(--font-mono)',
          fontSize: skill.proficiency === 'EXPERT' ? 11 : skill.proficiency === 'ADVANCED' ? 10 : 9,
          fontWeight: skill.proficiency === 'EXPERT' ? 700 : 400,
          color: selected ? color : '#C8A8E9',
          letterSpacing: '0.12em',
          textShadow: selected ? `0 0 8px ${color}` : 'none',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {skill.label}
        </span>
      </div>
    </>
  )
}

// -----------------------------------------------------------
// NODE TYPES
// -----------------------------------------------------------
const nodeTypes = { core: CoreNode, protocol: ProtocolNode }

// -----------------------------------------------------------
// PACKET DOT
// -----------------------------------------------------------
interface PacketDot {
  id: string
  sourceX: number; sourceY: number
  targetX: number; targetY: number
  progress: number; speed: number
  color: string; size: number
}

// -----------------------------------------------------------
// BUILD NODES
// -----------------------------------------------------------
function buildNodes(): Node[] {
  const nodes: Node[] = [
    {
      id: 'CORE', type: 'core',
      position: { x: 0, y: 0 },
      data: { label: 'CORE' },
      draggable: false,
    },
  ]
  NODE_IDS.forEach((id, i) => {
    nodes.push({
      id,
      type: 'protocol',
      position: getPosition(i),
      data: { label: SKILLS[id].label, id },
      draggable: false,
    })
  })
  return nodes
}

// Build edges
const EDGES = NODE_IDS.map(id => ({
  id:     `CORE-${id}`,
  source: 'CORE',
  target: id,
  type:   'default',
}))

// -----------------------------------------------------------
// BIO OVERLAY
// -----------------------------------------------------------
function BioOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,5,29,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 100, cursor: 'pointer',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 320,
          background: 'rgba(15,5,29,0.97)',
          border: '1px solid #00FFE7',
          boxShadow: '0 0 32px rgba(0,255,231,0.3)',
          padding: '20px 22px',
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: '#00FFE7', letterSpacing: '0.2em', textShadow: '0 0 12px #00FFE7' }}>
            EDDIE<span style={{ color: '#BC13FE' }}>-CODES-AI</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.2em', marginTop: 4 }}>
            NETWORK_ENGINEER · SEC_RESEARCHER · DEVELOPER
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,168,233,0.75)', lineHeight: 1.7, marginBottom: 16 }}>
          "Network engineer who breaks things to understand them."
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'EXPERIENCE', value: '3 YRS' },
            { label: 'SKILLS',     value: '12'    },
            { label: 'STATUS',     value: 'ACTIVE' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(188,19,254,0.06)', border: '1px solid rgba(188,19,254,0.2)', padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-retro)', fontSize: 18, color: '#BC13FE', textShadow: '0 0 8px #BC13FE' }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(200,168,233,0.4)', letterSpacing: '0.12em', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category legend */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          {([['language', '#00FFE7'], ['network', '#FF00FF'], ['tool', '#FFE600']] as const).map(([cat, col]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, background: col, boxShadow: `0 0 4px ${col}` }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(200,168,233,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{cat}</span>
            </div>
          ))}
        </div>

        <div onClick={onClose} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(0,255,231,0.4)', letterSpacing: '0.15em', cursor: 'pointer' }}>
          ▶ CLOSE
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------
export default function NetworkTree() {
  const [nodes, , onNodesChange] = useNodesState(buildNodes())
  const [edges, , onEdgesChange] = useEdgesState(EDGES)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const ripplesRef   = useRef<Ripple[]>([])
  const packetsRef   = useRef<PacketDot[]>([])
  const animIdRef    = useRef<number>(0)

  const [tooltip, setTooltip]   = useState<{ skill: SkillData; x: number; y: number } | null>(null)
  const [showBio, setShowBio]   = useState(false)

  // Pass onCoreClick into CORE node via node data
  const [builtNodes, setBuiltNodes] = useState(() => buildNodes())
  useEffect(() => {
    setBuiltNodes(prev => prev.map(n =>
      n.id === 'CORE' ? { ...n, data: { ...n.data, onCoreClick: () => setShowBio(true) } } : n
    ))
  }, [])

  // Spawn packets — category color matches skill
  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.random() > 0.5 ? 2 : 1
      for (let c = 0; c < count; c++) {
        const edge = EDGES[Math.floor(Math.random() * EDGES.length)]
        const src  = builtNodes.find(n => n.id === 'CORE')
        const tgt  = builtNodes.find(n => n.id === edge.target)
        if (!src || !tgt) continue
        const skill = SKILLS[tgt.id]
        const color = skill ? CATEGORY_COLOR[skill.category] : '#BC13FE'
        const prof  = skill?.proficiency ?? 'INTERMEDIATE'
        packetsRef.current.push({
          id:       `${Date.now()}-${Math.random()}`,
          sourceX:  src.position.x, sourceY: src.position.y,
          targetX:  tgt.position.x, targetY: tgt.position.y,
          progress: Math.random() * 0.08,
          speed:    0.005 + Math.random() * 0.01,
          color,
          size: prof === 'EXPERT' ? 5 : prof === 'ADVANCED' ? 4 : prof === 'INTERMEDIATE' ? 3 : 2.5,
        })
      }
      if (packetsRef.current.length > 60) packetsRef.current = packetsRef.current.slice(-60)
    }, 400)
    return () => clearInterval(interval)
  }, [builtNodes])

  // Canvas loop
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
      return { x: canvas!.width / 2 + x, y: canvas!.height / 2 + y }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ripples
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0.01)
      for (const r of ripplesRef.current) {
        const pos = toCanvas(r.x, r.y)
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,255,231,${r.alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
        r.radius += 4
        r.alpha  *= 0.91
      }

      // Packets
      packetsRef.current = packetsRef.current.filter(p => p.progress < 1)
      for (const p of packetsRef.current) {
        p.progress = Math.min(1, p.progress + p.speed)
        const s   = toCanvas(p.sourceX, p.sourceY)
        const tg  = toCanvas(p.targetX, p.targetY)
        const cpX = (s.x + tg.x) / 2 + (tg.y - s.y) * 0.25
        const cpY = (s.y + tg.y) / 2 - (tg.x - s.x) * 0.25
        const t   = p.progress
        const x   = (1-t)*(1-t)*s.x + 2*(1-t)*t*cpX + t*t*tg.x
        const y   = (1-t)*(1-t)*s.y + 2*(1-t)*t*cpY + t*t*tg.y

        ctx.shadowBlur  = 22
        ctx.shadowColor = p.color
        const halo = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4)
        halo.addColorStop(0,   p.color + 'ff')
        halo.addColorStop(0.4, p.color + 'aa')
        halo.addColorStop(1,   'transparent')
        ctx.beginPath()
        ctx.arc(x, y, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()

        ctx.shadowBlur  = 14
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.arc(x, y, p.size * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }

      ctx.shadowBlur    = 0
      animIdRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animIdRef.current); ro.disconnect() }
  }, [])

  // Node click
  const onNodeClick: NodeMouseHandler = useCallback((evt, node) => {
    if (node.id === 'CORE') return // handled by node itself

    const skill = SKILLS[node.id]
    if (skill) {
      setTooltip({ skill, x: evt.clientX + 12, y: evt.clientY + 12 })
    }

    // Ripple color matches category
    const color = skill ? CATEGORY_COLOR[skill.category] : '#BC13FE'
    for (let i = 0; i < 5; i++) {
      ripplesRef.current.push({
        x: node.position.x, y: node.position.y,
        radius: 8 + i * 22,
        alpha:  1 - i * 0.18,
        nodeId: node.id,
      })
    }
  }, [])

  return (
    <div className="relative w-full h-full" style={{ background: 'transparent' }}>
      <ReactFlow
        nodes={builtNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.4}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        style={{ background: 'transparent' }}
      >
        <Background color="#BC13FE" gap={32} size={0.5} style={{ opacity: 0.05 }} />
      </ReactFlow>

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', zIndex: 10 }}
      />

      {/* Bio overlay */}
      {showBio && <BioOverlay onClose={() => setShowBio(false)} />}

      {/* Skill tooltip */}
      {tooltip && (
        <SkillTooltip
          skill={tooltip.skill}
          x={tooltip.x}
          y={tooltip.y}
          onClose={() => setTooltip(null)}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 pointer-events-none" style={{ zIndex: 20, display: 'flex', gap: 12 }}>
        {([['LANGUAGE', '#00FFE7'], ['NETWORK', '#FF00FF'], ['TOOL', '#FFE600']] as const).map(([cat, col]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, background: col, boxShadow: `0 0 4px ${col}` }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: `${col}99`, letterSpacing: '0.15em' }}>{cat}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-3 left-3 font-display text-xs pointer-events-none"
        style={{ color: 'rgba(188,19,254,0.4)', letterSpacing: '0.2em', zIndex: 20 }}>
        SKILL MAP
      </div>
      <div className="absolute top-3 right-3 font-mono pointer-events-none"
        style={{ fontSize: 9, color: 'rgba(200,168,233,0.3)', letterSpacing: '0.12em', zIndex: 20 }}>
        TAP NODE TO INSPECT · TAP CORE FOR BIO
      </div>
    </div>
  )
}
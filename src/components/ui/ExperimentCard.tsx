'use client'

// --- ExperimentCard — single project card with status indicator ---

import { motion } from 'motion/react'
import { STATUS_COLORS } from '@/lib/constants'
import type { ExperimentCard as ExperimentCardType } from '@/lib/types'

interface ExperimentCardProps {
  card: ExperimentCardType
  index: number
}

export default function ExperimentCard({ card, index }: ExperimentCardProps) {
  const dotColor = STATUS_COLORS[card.status] ?? '#BC13FE'
  const isLocked = card.status === 'LOCKED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: 'easeOut' }}
      whileHover={
        isLocked
          ? {}
          : {
              scale: 1.02,
              borderColor: '#00FFE7',
              boxShadow: '0 0 16px rgba(0,255,231,0.25)',
              transition: { duration: 0.15 },
            }
      }
      className="flex flex-col gap-2 p-3 cursor-default"
      style={{
        background: 'rgba(188,19,254,0.04)',
        border: '1px solid rgba(188,19,254,0.25)',
        opacity: isLocked ? 0.6 : 1,
        filter: isLocked ? 'saturate(0.4)' : 'none',
      }}
    >
      {/* --- Top row: name + status dot --- */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-display font-bold tracking-widest truncate"
          style={{ fontSize: 11, color: '#C8A8E9', letterSpacing: '0.18em' }}
        >
          {card.name}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Animated dot — pulse only for ACTIVE */}
          <span className="relative inline-flex">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: dotColor, boxShadow: `0 0 5px ${dotColor}` }}
            />
            {card.status === 'ACTIVE' && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: dotColor }}
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </span>

          <span
            className="font-mono"
            style={{ fontSize: 9, color: dotColor, letterSpacing: '0.15em' }}
          >
            {card.status}
          </span>
        </div>
      </div>

      {/* --- Language badge --- */}
      <div className="flex items-center gap-2">
        <span
          className="font-mono px-1.5 py-0.5"
          style={{
            fontSize: 9,
            color: '#BC13FE',
            background: 'rgba(188,19,254,0.12)',
            border: '1px solid rgba(188,19,254,0.3)',
            letterSpacing: '0.1em',
          }}
        >
          {card.language}
        </span>
      </div>

      {/* --- Description --- */}
      {card.description && (
        <p
          className="font-mono leading-relaxed"
          style={{ fontSize: 10, color: 'rgba(200,168,233,0.55)' }}
        >
          {isLocked ? '██████ ██████ ██████ ██████' : card.description}
        </p>
      )}
    </motion.div>
  )
}
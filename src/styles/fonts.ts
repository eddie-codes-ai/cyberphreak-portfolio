// --- next/font configuration ---

import { Orbitron, Share_Tech_Mono, VT323 } from 'next/font/google'

export const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
  display: 'swap',
})

export const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

export const vt323 = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-retro',
  display: 'swap',
})

// Combined class string for use in layout.tsx
export const fontVariables = [
  orbitron.variable,
  shareTechMono.variable,
  vt323.variable,
].join(' ')
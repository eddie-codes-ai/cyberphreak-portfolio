// --- Root layout — fonts, metadata, global CSS ---
// SERVER component (no 'use client')

import type { Metadata, Viewport } from 'next'
import { fontVariables } from '@/styles/fonts'
import './globals.css'

export const metadata: Metadata = {
  title:       'CYBERPHREAK — CHAOTIC CREATIVE',
  description: 'Network engineer. Security researcher. Chaotic creative.',
  keywords:    ['cyberpunk', 'portfolio', 'networking', 'security', 'developer'],
  authors:     [{ name: 'CHAOTIC CREATIVE' }],
  robots:      'index, follow',
  openGraph: {
    title:       'CYBERPHREAK',
    description: 'Network engineer. Security researcher. Chaotic creative.',
    type:        'website',
  },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#0F051D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
      </body>
    </html>
  )
}
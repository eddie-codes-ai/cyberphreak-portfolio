// --- Utilities ---

import { LOG_PROTOS, LOG_RESULTS } from './constants'
import type { LogLine } from './types'

// --- Random helpers ---
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomItem<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

// --- Network ---
export function randomIP(): string {
  return `${randomInt(10, 223)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`
}

export function randomPort(): number {
  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 8080, 8443]
  return Math.random() > 0.5 ? randomItem(commonPorts) : randomInt(1024, 65535)
}

export function generateLogLine(): LogLine {
  return {
    proto: randomItem(LOG_PROTOS),
    ip: randomIP(),
    port: randomPort(),
    result: randomItem(LOG_RESULTS),
    timestamp: Date.now(),
  }
}

// --- Formatting ---
export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function formatLogLine(log: LogLine): string {
  const time = new Date(log.timestamp).toTimeString().slice(0, 8)
  return `[${time}] [${log.proto.padEnd(4)}] ${log.ip.padEnd(15)}:${String(log.port).padStart(5)} → ${log.result}`
}

// --- Math / Animation ---
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

// --- Mouse speed → threat percent ---
export function mouseSpeedToThreatPct(speed: number): number {
  // speed typically 0–80px/frame, map to 0–100
  return clamp(mapRange(speed, 0, 60, 0, 100), 0, 100)
}

// --- Hex color with opacity ---
export function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// --- randomInRange (float) ---
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
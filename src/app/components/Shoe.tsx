import { useId } from 'react'

import type { MaterialKey, Silhouette } from '../../data/products'
import { cx } from '../lib/cx'
import { shoeArt } from './shoeArt'

// The shoe is drawn, not photographed. Four Noto Emoji profiles are recoloured
// at runtime from the customer's spec, which is what makes the studio feel
// live: every swatch is the same drawing with new paint.

function shade(hex: string, factor: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  if (full.length !== 6) return hex
  const channel = (i: number) =>
    Math.max(0, Math.min(255, Math.round(parseInt(full.slice(i, i + 2), 16) * factor)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(0)}${channel(2)}${channel(4)}`
}

function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  if (full.length !== 6) return false
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

const MATERIAL_FILTER: Record<MaterialKey, string> = {
  calf: 'none',
  pebbled: 'contrast(0.96) brightness(1.04)',
  suede: 'saturate(0.86) brightness(1.05)',
  knit: 'contrast(1.06) saturate(1.04)',
}

/** Monogram placement in the 128-unit art space. */
const MONO: Record<Silhouette, { x: number; y: number; rotate: number }> = {
  runner: { x: 96, y: 88, rotate: -8 },
  court: { x: 100, y: 82, rotate: -6 },
  boot: { x: 95, y: 74, rotate: -6 },
  slip: { x: 96, y: 80, rotate: -8 },
}

export interface ShoeProps {
  silhouette?: Silhouette
  upper: string
  panel: string
  sole: string
  laces: string
  material?: MaterialKey
  monogram?: string
  label?: string
  className?: string
  shadow?: boolean
}

export function Shoe({
  silhouette = 'runner',
  upper,
  panel,
  sole,
  laces,
  material = 'calf',
  monogram = '',
  label,
  className,
  shadow = true,
}: ShoeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const rope = monogram.trim().toUpperCase().slice(0, 3)

  const tokens: Record<string, string> = {
    uid: `shoe${uid}`,
    upper,
    panel,
    sole,
    laces,
    dark: shade(upper, 0.62),
    darker: shade(upper, 0.4),
    light: shade(upper, 1.16),
    soleShadow: shade(sole, 0.82),
    laceShadow: shade(laces, 0.72),
    metal: '#b4ada0',
  }

  const html = shoeArt[silhouette].replace(/\{\{(\w+)\}\}/g, (_, key: string) => tokens[key] ?? '#000000')
  const mono = MONO[silhouette]

  return (
    <div
      className={cx('relative w-full', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div
        className={cx(
          'w-full [&>svg]:block [&>svg]:h-auto [&>svg]:w-full',
          shadow && '[&>svg]:drop-shadow-[0_18px_18px_rgba(25,24,19,0.16)]',
        )}
        style={{ filter: MATERIAL_FILTER[material] }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {rope && (
        <svg viewBox="0 0 128 128" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
          <text
            x={mono.x}
            y={mono.y}
            transform={`rotate(${mono.rotate} ${mono.x} ${mono.y})`}
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="5.4"
            fontWeight="700"
            letterSpacing="0.55"
            fill={isDark(upper) ? 'rgba(255,255,255,0.82)' : 'rgba(25,24,19,0.62)'}
          >
            {rope}
          </text>
        </svg>
      )}
    </div>
  )
}

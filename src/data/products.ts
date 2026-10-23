// The Raxx catalogue. Every pair is made to order, so products are models
// rather than stock: a silhouette, a base price and a set of house colourways.
// The studio then lets a customer change any part of the colourway.

export type Category = 'low' | 'run' | 'boot' | 'slip'
export type Silhouette = 'runner' | 'court' | 'boot' | 'slip'

export interface Colorway {
  name: string
  upper: string
  panel: string
  sole: string
  laces: string
}

export interface Product {
  slug: string
  name: string
  price: number
  category: Category
  silhouette: Silhouette
  short: string
  description: string
  details: string[]
  materials: string
  colorways: Colorway[]
  badge?: 'New' | 'Bestseller' | 'Low stock'
  featured?: boolean
}

export const categories: { key: Category; label: string; blurb: string; model: string }[] = [
  { key: 'low', label: 'Low tops', blurb: 'The everyday cut', model: 'axis-low' },
  { key: 'run', label: 'Runners', blurb: 'Built to move', model: 'tempo-runner' },
  { key: 'boot', label: 'Boots', blurb: 'Resoled, not replaced', model: 'foundry-boot' },
  { key: 'slip', label: 'Slip-ons', blurb: 'No laces, no fuss', model: 'drift-slip' },
]

export const products: Product[] = [
  {
    slug: 'axis-low',
    name: 'Axis Low',
    price: 245,
    category: 'low',
    silhouette: 'runner',
    badge: 'Bestseller',
    short: 'The low top we build around',
    description:
      'Our house low top, cut from a single full-grain panel so there is nothing to break in but the idea of it. A cork footbed takes the shape of your arch, and the cupsole is stitched, not glued, so it can be replaced when the miles add up.',
    details: ['Made to order in 3 to 4 weeks', 'Cork and latex footbed, moulds to your foot', 'Stitched cupsole, resoleable for life'],
    materials: 'Italian full-grain calf upper, vegetable-tanned lining, natural cork footbed, rubber cupsole.',
    colorways: [
      { name: 'Bone / Ink', upper: '#e5dcc9', panel: '#191813', sole: '#f5f1e6', laces: '#191813' },
      { name: 'Ink / Volt', upper: '#191813', panel: '#c9f24d', sole: '#232219', laces: '#c9f24d' },
      { name: 'Cognac', upper: '#8c4f28', panel: '#c19764', sole: '#d9c9ac', laces: '#f5f1e6' },
    ],
    featured: true,
  },
  {
    slug: 'court-01',
    name: 'Court 01',
    price: 250,
    category: 'low',
    silhouette: 'court',
    short: 'The one with the hand-stitched apron',
    description:
      'A court shoe with a hand-stitched apron and a low, flat sidewall. We kept the shape sharp and the padding minimal, so it looks right with a suit and survives a summer of walking.',
    details: ['Made to order in 3 to 4 weeks', 'Hand-stitched apron seam', 'Leather sole with a rubber heel insert'],
    materials: 'Full-grain calf upper, natural leather lining, stitched leather sole.',
    colorways: [
      { name: 'Chalk / Cognac', upper: '#f5f1e6', panel: '#8c4f28', sole: '#2a241c', laces: '#f5f1e6' },
      { name: 'Wine / Cream', upper: '#5c2231', panel: '#c19764', sole: '#2a241c', laces: '#c19764' },
      { name: 'Ink', upper: '#191813', panel: '#3a372d', sole: '#191813', laces: '#c19764' },
    ],
    featured: true,
  },
  {
    slug: 'tempo-runner',
    name: 'Tempo Runner',
    price: 265,
    category: 'run',
    silhouette: 'runner',
    badge: 'New',
    short: 'For the 6am loop and after',
    description:
      'Not a racing shoe. A daily runner with a firm, readable ride: a rockered toe, a wide forefoot and a heel counter that holds without pinching. The upper is perforated by hand, pair by pair, so it breathes where your foot runs hottest.',
    details: ['Made to order in 3 to 4 weeks', 'Rockered high-rebound foam midsole', 'Hand-perforated toe box'],
    materials: 'Engineered knit upper with suede overlays, recycled foam midsole, abrasion-resistant rubber.',
    colorways: [
      { name: 'Slate / Volt', upper: '#6c7378', panel: '#c9f24d', sole: '#f5f1e6', laces: '#f5f1e6' },
      { name: 'Bone / Clay', upper: '#e5dcc9', panel: '#b4512f', sole: '#f5f1e6', laces: '#b4512f' },
      { name: 'Ink / Gum', upper: '#191813', panel: '#191813', sole: '#c19764', laces: '#191813' },
    ],
    featured: true,
  },
  {
    slug: 'foundry-boot',
    name: 'Foundry Boot',
    price: 340,
    category: 'boot',
    silhouette: 'boot',
    short: 'Goodyear-welted, for a decade',
    description:
      'A plain-toe work boot made the old way. Goodyear welted so the sole can come off and go back on, lined in vegetable-tanned leather that softens rather than cracks, and finished by hand with a wax that darkens with every season.',
    details: ['Made to order in 3 to 4 weeks', 'Goodyear welted, fully resoleable', 'Hand-burnished toe and heel'],
    materials: 'Full-grain Italian calf, vegetable-tanned lining, leather insole, Vibram lug outsole.',
    colorways: [
      { name: 'Cognac / Gum', upper: '#8c4f28', panel: '#c19764', sole: '#2a241c', laces: '#c19764' },
      { name: 'Ink', upper: '#191813', panel: '#3a372d', sole: '#191813', laces: '#c19764' },
      { name: 'Olive', upper: '#5b6140', panel: '#c8a977', sole: '#2a241c', laces: '#c8a977' },
    ],
    featured: true,
  },
  {
    slug: 'drift-slip',
    name: 'Drift Slip',
    price: 215,
    category: 'slip',
    silhouette: 'slip',
    short: 'Twelve hours, no laces',
    description:
      'A slip-on with the structure of a lace-up: a hidden elastic gore, a firm heel counter and a sole thin enough to feel the ground. Cut from a single piece of leather at the vamp so it folds where your foot does.',
    details: ['Made to order in 3 to 4 weeks', 'Hidden elastic gore', 'Collapsible heel for travel'],
    materials: 'Italian full-grain calf, unlined vamp, natural rubber sole.',
    colorways: [
      { name: 'Chalk', upper: '#f5f1e6', panel: '#c9bfa9', sole: '#8c4f28', laces: '#f5f1e6' },
      { name: 'Ink / Gum', upper: '#191813', panel: '#3a372d', sole: '#bb9364', laces: '#191813' },
      { name: 'Olive / Cream', upper: '#5b6140', panel: '#d8cfb8', sole: '#8c4f28', laces: '#d8cfb8' },
    ],
    featured: true,
  },
  {
    slug: 'atelier-loafer',
    name: 'Atelier Loafer',
    price: 240,
    category: 'slip',
    silhouette: 'slip',
    short: 'Unlined, hand-stitched apron',
    description:
      'A summer loafer with a hand-stitched apron and an unlined vamp, so it breathes. The sole is stitched leather with a rubber insert at the heel: quiet on a stone floor, sure on a wet one.',
    details: ['Made to order in 3 to 4 weeks', 'Hand-stitched apron', 'Leather sole with rubber heel insert'],
    materials: 'Full-grain Italian calf, unlined vamp, stitched leather sole.',
    colorways: [
      { name: 'Wine / Cream', upper: '#5c2231', panel: '#e0d6c1', sole: '#2a241c', laces: '#e0d6c1' },
      { name: 'Bone / Ink', upper: '#e5dcc9', panel: '#191813', sole: '#8c4f28', laces: '#191813' },
      { name: 'Ink', upper: '#191813', panel: '#191813', sole: '#191813', laces: '#191813' },
    ],
  },
  {
    slug: 'ridge-hiker',
    name: 'Ridge Hiker',
    price: 365,
    category: 'boot',
    silhouette: 'boot',
    badge: 'Low stock',
    short: 'Weatherproofed, ankle-deep',
    description:
      'A hiker for wet mornings. The leather is weatherproofed in the tannery, the tongue is bellowsed against rain, and the lug pattern clears mud instead of collecting it. Heavy in the hand, light on the trail.',
    details: ['Made to order in 3 to 4 weeks', 'Waterproofed full-grain leather', 'Deep lug outsole, replaceable'],
    materials: 'Weatherproofed full-grain calf, sealed seams, Vibram lug outsole.',
    colorways: [
      { name: 'Olive / Ink', upper: '#5b6140', panel: '#191813', sole: '#2a241c', laces: '#e4c98f' },
      { name: 'Clay / Bone', upper: '#b4512f', panel: '#e5dcc9', sole: '#2a241c', laces: '#e5dcc9' },
      { name: 'Ink / Volt', upper: '#191813', panel: '#c9f24d', sole: '#232219', laces: '#c9f24d' },
    ],
  },
]

export const bySlug = (slug: string) => products.find((p) => p.slug === slug)
export const featured = products.filter((p) => p.featured)
export const newArrivals = products.slice(0, 4)

// ---------------------------------------------------------------------------
// Made-to-measure options

export type MaterialKey = 'calf' | 'pebbled' | 'suede' | 'knit'

export const materials: { key: MaterialKey; name: string; note: string; price: number }[] = [
  { key: 'calf', name: 'Smooth calf', note: 'Full-grain, Italian', price: 0 },
  { key: 'pebbled', name: 'Pebbled calf', note: 'Soft, forgiving grain', price: 20 },
  { key: 'suede', name: 'Suede', note: 'Velvety, water-repellent', price: 30 },
  { key: 'knit', name: 'Engineered knit', note: 'Breathable, sock-like', price: 15 },
]

export type WidthKey = 'standard' | 'wide'

export const widths: { key: WidthKey; name: string; note: string; price?: number }[] = [
  { key: 'standard', name: 'Standard', note: 'D width' },
  { key: 'wide', name: 'Wide', note: 'EE width', price: 15 },
]

export const SIZES = [
  'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10',
  'US 10.5', 'US 11', 'US 11.5', 'US 12', 'US 12.5', 'US 13', 'US 13.5', 'US 14',
]

export const MONOGRAM_PRICE = 18

export interface CustomSpec {
  upper: string
  panel: string
  sole: string
  laces: string
  material: MaterialKey
  size: string
  width: WidthKey
  monogram: string
}

export function defaultCustom(product: Product): CustomSpec {
  const cw = product.colorways[0]
  return {
    upper: cw.upper,
    panel: cw.panel,
    sole: cw.sole,
    laces: cw.laces,
    material: 'calf',
    size: 'US 9',
    width: 'standard',
    monogram: '',
  }
}

export const materialOf = (key: MaterialKey) => materials.find((m) => m.key === key) ?? materials[0]

export function customPrice(product: Product, custom?: Partial<CustomSpec>): number {
  const material = materialOf((custom?.material as MaterialKey) ?? 'calf')
  const wide = widths.find((w) => w.key === (custom?.width ?? 'standard'))?.price ?? 0
  const mono = custom?.monogram?.trim() ? MONOGRAM_PRICE : 0
  return product.price + material.price + wide + mono
}

/** A stable identity for a made-to-measure line in the bag. */
export function customId(slug: string, custom: CustomSpec): string {
  return JSON.stringify([
    slug,
    custom.upper,
    custom.panel,
    custom.sole,
    custom.laces,
    custom.material,
    custom.size,
    custom.width,
    custom.monogram.trim().toUpperCase(),
  ])
}

export function colourName(hex: string): string {
  return palette.find((p) => p.hex.toLowerCase() === hex.toLowerCase())?.name ?? hex.toUpperCase()
}

// ---------------------------------------------------------------------------
// The swatch book

export const palette = [
  { name: 'Chalk', hex: '#f5f1e6' },
  { name: 'Bone', hex: '#e5dcc9' },
  { name: 'Ink', hex: '#191813' },
  { name: 'Slate', hex: '#6c7378' },
  { name: 'Volt', hex: '#c9f24d' },
  { name: 'Olive', hex: '#5b6140' },
  { name: 'Cognac', hex: '#8c4f28' },
  { name: 'Gum', hex: '#c19764' },
  { name: 'Clay', hex: '#b4512f' },
  { name: 'Cobalt', hex: '#2c4bbd' },
  { name: 'Petal', hex: '#dfa59c' },
  { name: 'Wine', hex: '#5c2231' },
]

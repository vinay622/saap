import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { bySlug, customId, customPrice, defaultCustom, type CustomSpec, type Product } from '../../data/products'

export interface CartLine {
  id: string
  slug: string
  custom: CustomSpec
  quantity: number
}

interface CartItem extends CartLine {
  product: Product
  unitPrice: number
}

interface CartState {
  lines: CartLine[]
  open: boolean
  add: (product: Product, custom: CustomSpec, quantity?: number) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
  setOpen: (open: boolean) => void
  count: number
  subtotal: number
  items: CartItem[]
}

const CartContext = createContext<CartState | null>(null)
const KEY = 'raxx-bag-v1'

function hydrate(raw: string): CartLine[] {
  const parsed = JSON.parse(raw) as CartLine[]
  return parsed
    .filter((line) => line && typeof line.slug === 'string' && bySlug(line.slug) && line.custom)
    .map((line) => {
      const product = bySlug(line.slug)!
      const fallback = defaultCustom(product)
      const custom = { ...fallback, ...line.custom }
      return { ...line, custom, id: customId(line.slug, custom), quantity: Math.max(1, Math.min(9, line.quantity || 1)) }
    })
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? hydrate(raw) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines))
  }, [lines])

  const add = useCallback((product: Product, custom: CustomSpec, quantity = 1) => {
    const id = customId(product.slug, custom)
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id)
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(9, l.quantity + quantity) } : l))
      }
      return [...prev, { id, slug: product.slug, custom, quantity }]
    })
    setOpen(true)
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, quantity: Math.min(9, quantity) } : l)),
    )
  }, [])

  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartState>(() => {
    const items = lines.map((line) => {
      const product = bySlug(line.slug)!
      return { ...line, product, unitPrice: customPrice(product, line.custom) }
    })
    return {
      lines,
      open,
      add,
      setQuantity,
      remove,
      clear,
      setOpen,
      items,
      count: items.reduce((n, l) => n + l.quantity, 0),
      subtotal: items.reduce((n, l) => n + l.quantity * l.unitPrice, 0),
    }
  }, [lines, open, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart outside CartProvider')
  return ctx
}

export const money = (value: number) => `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`

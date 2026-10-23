import { AnimatePresence, motion } from 'motion/react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { categories, products } from '../../data/products'
import { ProductCard } from '../components/ProductCard'
import { Button, Container } from '../components/ui'
import { cx } from '../lib/cx'

const priceOptions = [
  { key: '', label: 'Any price' },
  { key: '0-250', label: 'Under $250' },
  { key: '250-320', label: '$250 – $320' },
  { key: '320-', label: 'Over $320' },
]

const sortOptions = [
  { key: 'featured', label: 'Featured' },
  { key: 'new', label: 'Newest' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
]

export function Shop() {
  const [params, setParams] = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const category = params.get('category') ?? ''
  const price = params.get('price') ?? ''
  const sort = params.get('sort') ?? 'featured'

  function update(next: Record<string, string>) {
    const merged = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) v ? merged.set(k, v) : merged.delete(k)
    setParams(merged, { replace: true })
  }

  const list = useMemo(() => {
    let items = products.filter((p) => !category || p.category === category)
    if (price) {
      const [min, max] = price.split('-').map((v) => (v === '' ? undefined : Number(v)))
      items = items.filter((p) => (min === undefined || p.price >= min) && (max === undefined || p.price < max))
    }
    if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)
    if (sort === 'new') items = [...items].sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0))
    if (sort === 'featured') items = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return items
  }, [category, price, sort])

  const title = categories.find((c) => c.key === category)?.label ?? 'All models'
  const activeCount = (category ? 1 : 0) + (price ? 1 : 0)

  const filters = (
    <div className="flex flex-col gap-7">
      <div>
        <p className="label text-muted">Category</p>
        <ul className="mt-3 flex flex-col gap-0.5">
          {[{ key: '', label: 'Everything' }, ...categories].map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => update({ category: c.key })}
                aria-pressed={category === c.key}
                className={cx(
                  'flex h-9 w-full items-center gap-2 rounded-[10px] px-2.5 text-left text-[14px] transition-colors',
                  category === c.key ? 'bg-surface-2 text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {c.label}
                <span className="ml-auto text-[12px] tabular-nums text-faint">
                  {c.key ? products.filter((p) => p.category === c.key).length : products.length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="label text-muted">Price</p>
        <ul className="mt-3 flex flex-col gap-0.5">
          {priceOptions.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => update({ price: p.key })}
                aria-pressed={price === p.key}
                className={cx(
                  'flex h-9 w-full items-center rounded-[10px] px-2.5 text-left text-[14px] transition-colors',
                  price === p.key ? 'bg-surface-2 text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <Container className="pt-10 sm:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label text-muted">Shop / Made to order</p>
          <h1 className="font-display mt-3 text-[clamp(40px,6vw,64px)] uppercase leading-[0.88]">
            {title} <span className="align-top text-[20px] tracking-normal text-faint">{list.length}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <SlidersHorizontal />
            Filters{activeCount > 0 && ` (${activeCount})`}
          </Button>
          <label className="relative">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="h-10 appearance-none rounded-[11px] border border-line-strong bg-transparent pl-4 pr-9 text-[13.5px] focus:border-fg focus:outline-none"
            >
              {sortOptions.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[{ key: '', label: 'All' }, ...categories].map((c) => (
          <button
            key={c.key || 'all'}
            type="button"
            onClick={() => update({ category: c.key })}
            className={cx(
              'h-9 rounded-full border px-4 text-[13px] transition-colors',
              category === c.key ? 'border-fg bg-fg text-bg' : 'border-line-strong text-muted hover:border-fg hover:text-fg',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{filters}</div>
        </aside>
        <div>
          <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3 xl:gap-x-6">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {list.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-display text-[32px] uppercase">Nothing in this range</p>
              <p className="mt-2 text-[14px] text-muted">Try another category or clear the price band.</p>
              <Button variant="secondary" className="mt-6" onClick={() => update({ category: '', price: '' })}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 bg-fg/35 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-2 bottom-2 rounded-dialog bg-bg p-6 shadow-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-[28px] uppercase">Filters</p>
                <button type="button" aria-label="Close" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-control hover:bg-surface-2">
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-6">{filters}</div>
              <Button className="mt-8 w-full" onClick={() => setMobileOpen(false)}>
                Show {list.length} {list.length === 1 ? 'model' : 'models'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  )
}

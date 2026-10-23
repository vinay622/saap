import { AnimatePresence, motion } from 'motion/react'
import { Check, Link2, RotateCcw, Shuffle, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'

import {
  bySlug,
  colourName,
  customPrice,
  defaultCustom,
  materialOf,
  materials,
  MONOGRAM_PRICE,
  palette,
  products,
  SIZES,
  widths,
  type CustomSpec,
  type MaterialKey,
  type Product,
} from '../../data/products'
import { money, useCart } from '../lib/cart'
import { cx } from '../lib/cx'
import { Shoe } from '../components/Shoe'
import { Button, Container } from '../components/ui'

function hex(value: string | null, fallback: string): string {
  if (!value) return fallback
  const h = value.startsWith('#') ? value : `#${value}`
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toLowerCase() : fallback
}

function specFrom(product: Product, params: URLSearchParams): CustomSpec {
  const base = defaultCustom(product)
  const materialParam = params.get('material')
  const material = materials.some((m) => m.key === materialParam) ? (materialParam as MaterialKey) : base.material
  const sizeParam = params.get('size')
  const widthParam = params.get('width')
  return {
    upper: hex(params.get('u'), base.upper),
    panel: hex(params.get('p'), base.panel),
    sole: hex(params.get('s'), base.sole),
    laces: hex(params.get('l'), base.laces),
    material,
    size: sizeParam && SIZES.includes(sizeParam) ? sizeParam : base.size,
    width: widthParam === 'wide' ? 'wide' : 'standard',
    monogram: (params.get('mono') ?? '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase(),
  }
}

export function Studio() {
  const [params, setParams] = useSearchParams()
  const initialSlug = bySlug(params.get('model') ?? '') ? params.get('model')! : 'axis-low'
  const [slug, setSlug] = useState(initialSlug)
  const product = bySlug(slug)!
  const [custom, setCustom] = useState<CustomSpec>(() => specFrom(product, params))
  const [copied, setCopied] = useState(false)
  const [added, setAdded] = useState(false)
  const cart = useCart()

  const price = customPrice(product, custom)
  const material = materialOf(custom.material)
  const wide = widths.find((w) => w.key === custom.width)?.price ?? 0
  const monogram = custom.monogram.trim() ? MONOGRAM_PRICE : 0

  useEffect(() => {
    const next = new URLSearchParams()
    next.set('model', slug)
    next.set('u', custom.upper.replace('#', ''))
    next.set('p', custom.panel.replace('#', ''))
    next.set('s', custom.sole.replace('#', ''))
    next.set('l', custom.laces.replace('#', ''))
    next.set('material', custom.material)
    next.set('size', custom.size)
    next.set('width', custom.width)
    if (custom.monogram.trim()) next.set('mono', custom.monogram.trim().toUpperCase())
    setParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, custom])

  function patch(next: Partial<CustomSpec>) {
    setCustom((prev) => ({ ...prev, ...next }))
  }

  function pickModel(next: Product) {
    setSlug(next.slug)
    setCustom((prev) => {
      const base = defaultCustom(next)
      return { ...base, size: prev.size, width: prev.width, monogram: prev.monogram }
    })
  }

  function shuffle() {
    const pick = () => palette[Math.floor(Math.random() * palette.length)].hex
    let upper = pick()
    let panel = pick()
    while (panel === upper) panel = pick()
    const sole = pick()
    const laces = pick()
    patch({ upper, panel, sole, laces })
  }

  function reset() {
    setCustom({ ...defaultCustom(product), size: custom.size })
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function add() {
    cart.add(product, custom)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const designName = useMemo(
    () => `${colourName(custom.upper)} / ${colourName(custom.panel)}`,
    [custom.upper, custom.panel],
  )

  return (
    <Container className="pb-24 pt-8 sm:pt-10 lg:pb-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label text-accent">The studio / Live</p>
          <h1 className="font-display mt-3 text-[clamp(44px,7vw,80px)] uppercase leading-[0.86]">
            Make it <span className="text-accent">yours.</span>
          </h1>
          <p className="mt-3 max-w-[500px] text-[14.5px] leading-relaxed text-muted">
            Every panel, every stitch, one pair. Changes show up on the shoe as you make them — and the link in your bar remembers the design.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={shuffle}>
            <Shuffle />
            Surprise me
          </Button>
          <Button variant="secondary" size="sm" onClick={copy}>
            {copied ? <Check /> : <Link2 />}
            {copied ? 'Link copied' : 'Share design'}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="lg:sticky lg:top-[90px] lg:self-start">
          <div className="mb-3 flex gap-1.5 overflow-x-auto scrollbar-none">
            {products.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => pickModel(p)}
                aria-pressed={p.slug === slug}
                className={cx(
                  'h-9 shrink-0 rounded-full border px-3.5 text-[12.5px] transition-colors',
                  p.slug === slug ? 'border-fg bg-fg text-bg' : 'border-line-strong text-muted hover:border-fg hover:text-fg',
                )}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div
            className="stage relative overflow-hidden rounded-[28px] border border-line/70"
            style={{ background: `radial-gradient(78% 70% at 50% 40%, #fdfaf2, color-mix(in srgb, ${custom.upper} 13%, #ece5d7))` }}
          >
            <div className="pointer-events-none absolute inset-0 hairline-grid opacity-50" aria-hidden />
            <div className="absolute inset-x-5 top-5 z-10 flex items-start justify-between gap-3">
              <div>
                <p className="label text-[9px] text-muted">Live design</p>
                <p className="mt-1 text-[13px] font-medium">{designName}</p>
              </div>
              <span className="label rounded-[7px] bg-bg/80 px-2 py-[5px] text-[9px] backdrop-blur">Made to order</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${slug}-${custom.upper}-${custom.panel}-${custom.sole}-${custom.laces}-${custom.material}`}
                initial={{ opacity: 0.4, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="px-3 pb-20 pt-12 sm:px-6"
              >
                <Shoe {...custom} silhouette={product.silhouette} label={`${product.name} in ${designName}`} className="mx-auto max-w-[540px]" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-4 bottom-4 z-10 grid grid-cols-3 gap-2">
              {[
                ['Material', material.name],
                ['Size', `${custom.size.replace('US ', '')} · ${custom.width === 'wide' ? 'Wide' : 'Standard'}`],
                ['Monogram', custom.monogram.trim() ? custom.monogram.toUpperCase() : 'None'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[12px] border border-line/70 bg-bg/75 px-2.5 py-2 backdrop-blur">
                  <p className="label text-[8px] text-faint">{label}</p>
                  <p className="mt-0.5 truncate text-[11.5px] font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {[custom.upper, custom.panel, custom.sole, custom.laces].map((c, i) => (
                <span key={i} className="size-3.5 rounded-full ring-1 ring-inset ring-fg/15" style={{ backgroundColor: c }} title={colourName(c)} />
              ))}
              <span className="ml-1 text-[12px] text-muted">{product.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              Ships in 3–4 weeks
            </div>
          </div>
        </div>

        <div>
          <Panel step="01" title="Colour" hint={<span className="text-[12.5px] text-muted">Tap a swatch</span>}>
            <div className="flex flex-wrap gap-2">
              {product.colorways.map((cw) => (
                <button
                  key={cw.name}
                  type="button"
                  onClick={() => patch({ upper: cw.upper, panel: cw.panel, sole: cw.sole, laces: cw.laces })}
                  className="flex items-center gap-2 rounded-full border border-line-strong py-1 pl-1 pr-3 text-[12px] text-muted transition-colors hover:border-fg hover:text-fg"
                >
                  <span
                    className="round size-6 rounded-full outline outline-1 -outline-offset-1 outline-fg/15"
                    style={{ background: `linear-gradient(135deg, ${cw.upper} 0 52%, ${cw.panel} 52% 76%, ${cw.sole} 76% 100%)` }}
                  />
                  {cw.name}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <Swatches label="Upper" value={custom.upper} onChange={(upper) => patch({ upper })} />
              <Swatches label="Overlay" value={custom.panel} onChange={(panel) => patch({ panel })} />
              <Swatches label="Sole" value={custom.sole} onChange={(sole) => patch({ sole })} />
              <Swatches label="Laces" value={custom.laces} onChange={(laces) => patch({ laces })} />
            </div>
          </Panel>

          <Panel step="02" title="Material" hint={<span className="text-[12.5px] text-muted">From the tannery</span>}>
            <div className="grid grid-cols-2 gap-2">
              {materials.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => patch({ material: m.key })}
                  aria-pressed={custom.material === m.key}
                  className={cx(
                    'rounded-[14px] border p-3 text-left transition-colors',
                    custom.material === m.key ? 'border-fg bg-surface' : 'border-line hover:border-line-strong',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13.5px] font-medium">{m.name}</p>
                    <span className="label shrink-0 text-[9px] text-muted">{m.price === 0 ? '—' : `+${money(m.price)}`}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted">{m.note}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel step="03" title="Fit" hint={<span className="text-[12.5px] text-muted">US sizing</span>}>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => patch({ size: s })}
                  aria-pressed={custom.size === s}
                  className={cx(
                    'h-10 rounded-[10px] border text-[12.5px] tabular-nums transition-colors',
                    custom.size === s ? 'border-fg bg-fg text-bg' : 'border-line-strong text-fg hover:border-fg',
                  )}
                >
                  {s.replace('US ', '')}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {widths.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  onClick={() => patch({ width: w.key })}
                  aria-pressed={custom.width === w.key}
                  className={cx(
                    'flex items-center justify-between rounded-[12px] border px-3 py-2.5 text-left transition-colors',
                    custom.width === w.key ? 'border-fg bg-surface' : 'border-line hover:border-line-strong',
                  )}
                >
                  <span>
                    <span className="block text-[13px] font-medium">{w.name}</span>
                    <span className="block text-[11.5px] text-muted">{w.note}</span>
                  </span>
                  <span className="label text-[9px] text-muted">{'price' in w && w.price ? `+${money(w.price)}` : '—'}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">Between sizes? Take the half size down — the calf gives about 2 mm after a week.</p>
          </Panel>

          <Panel step="04" title="Monogram" hint={<span className="text-[12.5px] text-muted">+{money(MONOGRAM_PRICE)}</span>}>
            <div className="flex items-center gap-2">
              <input
                value={custom.monogram}
                onChange={(e) => patch({ monogram: e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() })}
                placeholder="ABC"
                maxLength={3}
                aria-label="Monogram, up to three characters"
                className="h-12 w-28 rounded-control border border-line-strong bg-surface px-4 text-center text-[15px] font-semibold uppercase tracking-[0.2em] placeholder:text-faint focus:border-fg focus:outline-none"
              />
              <div className="text-[12.5px] leading-relaxed text-muted">
                <p>Embossed on the heel, no foil.</p>
                <p>Letters and numbers, up to three.</p>
              </div>
            </div>
          </Panel>

          <div className="border-t border-line pt-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[15px] font-medium">Your pair</h2>
              <p className="font-display text-[28px] leading-none tabular-nums">{money(price)}</p>
            </div>
            <dl className="mt-4 flex flex-col gap-1.5 text-[13.5px]">
              <Row label={`${product.name} · base`} value={money(product.price)} />
              <Row label={`${material.name} upper`} value={material.price ? `+${money(material.price)}` : 'Included'} muted />
              <Row label={`${custom.width === 'wide' ? 'Wide' : 'Standard'} width`} value={wide ? `+${money(wide)}` : 'Included'} muted />
              <Row label="Monogram" value={monogram ? `+${money(monogram)}` : 'None'} muted />
            </dl>

            <Button size="lg" className={cx('mt-5 w-full', added && 'bg-accent hover:bg-accent')} onClick={add}>
              {added ? (
                <>
                  <Check />
                  Added to bag
                </>
              ) : (
                <>
                  Add to bag · {money(price)}
                  <Sparkles />
                </>
              )}
            </Button>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[12px] text-faint">Free shipping · one free remake</p>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-fg">
                <RotateCcw className="size-3" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="label text-[9px] text-muted">{product.name}</p>
          <p className="text-[16px] tabular-nums">{money(price)}</p>
        </div>
        <Button onClick={add} className={cx(added && 'bg-accent hover:bg-accent')}>
          {added ? (
            <>
              <Check />
              Added
            </>
          ) : (
            <>
              Add to bag
              <Sparkles />
            </>
          )}
        </Button>
      </div>
    </Container>
  )
}

function Panel({ step, title, hint, children }: { step: string; title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-line py-6 first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="flex items-baseline gap-3">
          <span className="label text-[9px] text-accent">{step}</span>
          <span className="text-[15px] font-medium">{title}</span>
        </h2>
        {hint}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Swatches({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="label text-[9px] text-muted">{label}</p>
        <p className="text-[12px] text-muted">{colourName(value)}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {palette.map((c) => {
          const active = c.hex.toLowerCase() === value.toLowerCase()
          return (
            <button
              key={c.hex}
              type="button"
              onClick={() => onChange(c.hex)}
              aria-label={`${label}: ${c.name}`}
              aria-pressed={active}
              title={c.name}
              className={cx(
                'round size-7 rounded-full ring-1 ring-inset ring-fg/15 transition-transform hover:scale-110',
                active && 'ring-2 ring-fg ring-offset-2 ring-offset-bg',
              )}
              style={{ backgroundColor: c.hex }}
            />
          )
        })}
      </div>
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={muted ? 'text-muted' : ''}>{label}</dt>
      <dd className={cx('tabular-nums', muted ? 'text-muted' : '')}>{value}</dd>
    </div>
  )
}

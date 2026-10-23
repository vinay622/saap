import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'

import { bySlug, categories, customPrice, defaultCustom, MONOGRAM_PRICE, products, SIZES } from '../../data/products'
import { money, useCart } from '../lib/cart'
import { cx } from '../lib/cx'
import { Shoe } from '../components/Shoe'
import { Button, ButtonLink, Container, Stepper } from '../components/ui'
import { ProductCard } from '../components/ProductCard'

export function Product() {
  const { slug } = useParams()
  const product = slug ? bySlug(slug) : undefined
  const cart = useCart()
  const [colorwayIndex, setColorwayIndex] = useState(0)
  const [size, setSize] = useState('US 9')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [open, setOpen] = useState<number | null>(0)

  useEffect(() => {
    setColorwayIndex(0)
    setSize('US 9')
    setQuantity(1)
    window.scrollTo({ top: 0 })
  }, [product])

  if (!product) return <Navigate to="/shop" replace />

  const colorway = product.colorways[colorwayIndex] ?? product.colorways[0]
  const spec = { ...defaultCustom(product), ...colorway, size }
  const price = customPrice(product, spec)
  const category = categories.find((c) => c.key === product.category)?.label ?? product.category
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3)
  const sections = [
    { title: 'Details', body: product.details },
    { title: 'Materials and care', body: [product.materials, 'Wipe with a damp cloth. Cedar shoe trees included. Recondition with the wax in your box twice a year.'] },
    { title: 'Made to order and returns', body: ['Cut and stitched in Porto in 3 to 4 weeks. We email a photograph before it ships.', 'Free worldwide shipping. If the fit is wrong we remake the pair once, free of charge.'] },
  ]

  function add() {
    cart.add(product!, spec, quantity)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Container className="pt-6 sm:pt-8">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <Link to="/shop" className="inline-flex h-8 items-center gap-1.5 transition-colors hover:text-fg">
          <ArrowLeft className="size-3.5" />
          Shop
        </Link>
        <span className="text-faint">/</span>
        <span className="text-fg">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-[92px] lg:self-start">
          <div
            className="stage relative aspect-square overflow-hidden rounded-[28px] border border-line/70"
            style={{ background: `radial-gradient(75% 68% at 50% 40%, #fdfaf2, color-mix(in srgb, ${colorway.upper} 14%, #ece5d7))` }}
          >
            <div className="pointer-events-none absolute inset-0 hairline-grid opacity-50" aria-hidden />
            <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
              <span className="label rounded-[7px] bg-bg/80 px-2 py-[5px] text-[9px] backdrop-blur">Made to order</span>
              <span className="label text-[9px] text-muted">{colorway.name}</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={colorway.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center px-4 py-16 sm:px-8"
              >
                <Shoe
                  {...colorway}
                  silhouette={product.silhouette}
                  monogram="RX"
                  label={`${product.name} in ${colorway.name}`}
                  className="max-w-[520px]"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-line/70 bg-bg/70 p-3 backdrop-blur">
              <div className="flex items-center gap-2">
                {product.colorways.map((cw, i) => (
                  <button
                    key={cw.name}
                    type="button"
                    onClick={() => setColorwayIndex(i)}
                    aria-label={cw.name}
                    aria-pressed={i === colorwayIndex}
                    className={cx(
                      'round size-8 rounded-full outline outline-1 -outline-offset-1 outline-fg/15 transition-transform',
                      i === colorwayIndex ? 'scale-105 ring-2 ring-fg ring-offset-2 ring-offset-bg' : 'hover:scale-105',
                    )}
                    style={{ background: `linear-gradient(135deg, ${cw.upper} 0 52%, ${cw.panel} 52% 76%, ${cw.sole} 76% 100%)` }}
                  />
                ))}
              </div>
              <p className="label text-[9px] text-muted">{colorway.name}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              ['Cut', 'One panel, by hand'],
              ['Lasted', 'Three to four weeks'],
              ['Kept', 'Resole for life'],
            ].map(([title, note]) => (
              <div key={title} className="rounded-[14px] border border-line bg-surface/60 px-3 py-2.5">
                <p className="label text-[9px] text-accent">{title}</p>
                <p className="mt-1 text-[12px] text-muted">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pt-2">
          <p className="label text-muted">
            {category} / Model {String(products.findIndex((p) => p.slug === product.slug) + 1).padStart(2, '0')}
          </p>
          <h1 className="font-display mt-3 text-[clamp(42px,6vw,64px)] uppercase leading-[0.88]">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <p className="text-[22px] tabular-nums">{money(price)}</p>
            <span className="label rounded-[6px] bg-surface-2 px-2 py-1 text-[9px] text-muted">Free shipping</span>
          </div>
          <p className="mt-2 text-[13.5px] text-muted">{product.short}. Made to order, so it fits you and nobody else.</p>

          <p className="mt-6 text-pretty text-[15.5px] leading-relaxed text-fg/80">{product.description}</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="label text-muted">House colourway</p>
              <p className="text-[13px] text-muted">{colorway.name}</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {product.colorways.map((cw, i) => (
                <button
                  key={cw.name}
                  type="button"
                  onClick={() => setColorwayIndex(i)}
                  aria-pressed={i === colorwayIndex}
                  className={cx(
                    'flex flex-col items-start gap-2 rounded-[14px] border p-3 text-left transition-colors',
                    i === colorwayIndex ? 'border-fg bg-surface' : 'border-line hover:border-line-strong',
                  )}
                >
                  <span
                    className="h-8 w-full rounded-[8px] outline outline-1 -outline-offset-1 outline-fg/10"
                    style={{ background: `linear-gradient(120deg, ${cw.upper} 0 50%, ${cw.panel} 50% 78%, ${cw.sole} 78% 100%)` }}
                  />
                  <span className="text-[12px] leading-tight">{cw.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <p className="label text-muted">Size (US)</p>
              <span className="text-[12px] text-muted">Fits true. Wide width in the studio.</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cx(
                    'h-10 rounded-[10px] border text-[13px] tabular-nums transition-colors',
                    size === s ? 'border-fg bg-fg text-bg' : 'border-line-strong text-fg hover:border-fg',
                  )}
                >
                  {s.replace('US ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-[132px_1fr] gap-2.5">
            <Stepper value={quantity} onChange={setQuantity} />
            <Button onClick={add} className={cx('h-12 w-full', added && 'bg-accent hover:bg-accent')}>
              {added ? (
                <>
                  <Check />
                  Added to bag
                </>
              ) : (
                <>
                  Add to bag · {money(price * quantity)}
                  <Plus />
                </>
              )}
            </Button>
          </div>

          <ButtonLink to={`/studio?model=${product.slug}&size=${encodeURIComponent(size)}`} variant="secondary" className="mt-2.5 w-full">
            <Sparkles />
            Make it yours in the studio
            <ArrowRight />
          </ButtonLink>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-muted">
            <span>Made in 3–4 weeks</span>
            <span>Free returns & one free remake</span>
            <span>Monogram +{money(MONOGRAM_PRICE)}</span>
          </div>

          <ul className="mt-9 divide-y divide-line border-y border-line">
            {sections.map((s, i) => {
              const isOpen = open === i
              return (
                <li key={s.title}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="flex h-14 w-full items-center justify-between text-left text-[14.5px] font-medium">
                    {s.title}
                    {isOpen ? <Minus className="size-4 text-muted" /> : <Plus className="size-4 text-muted" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="flex flex-col gap-1.5 pb-5 text-[14px] leading-relaxed text-muted">
                          {s.body.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <section className="pt-20 sm:pt-28">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[clamp(30px,4vw,44px)] uppercase leading-none">Also on the last</h2>
          <Link to="/shop" className="hidden items-center gap-1.5 text-[13.5px] text-muted hover:text-fg sm:inline-flex">
            Shop all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </Container>
  )
}

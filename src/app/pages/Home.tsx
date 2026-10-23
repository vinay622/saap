import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { bySlug, categories, defaultCustom, materials, products, type Colorway, type Product } from '../../data/products'
import { ProductCard } from '../components/ProductCard'
import { Shoe } from '../components/Shoe'
import { Button, ButtonLink, Container, Reveal, SectionTitle } from '../components/ui'
import { money, useCart } from '../lib/cart'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

export function Home() {
  const axis = bySlug('axis-low')!
  const [colorway, setColorway] = useState<Colorway>(axis.colorways[0])

  return (
    <>
      <Hero product={axis} colorway={colorway} onColorway={setColorway} />
      <Ticker />
      <Collection />
      <Categories />
      <Process />
      <Materials />
      <FieldNotes />
      <Testimonials />
      <ClosingCTA />
    </>
  )
}

function Hero({ product, colorway, onColorway }: { product: Product; colorway: Colorway; onColorway: (c: Colorway) => void }) {
  const cart = useCart()
  const [added, setAdded] = useState(false)

  function add() {
    cart.add(product, { ...defaultCustom(product), upper: colorway.upper, panel: colorway.panel, sole: colorway.sole, laces: colorway.laces })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section className="relative overflow-hidden bg-ink text-bg">
      <div className="pointer-events-none absolute inset-0 volt-grid opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -right-10 top-10 hidden select-none font-display text-[260px] leading-none tracking-[-0.08em] text-bg/[0.04] lg:block" aria-hidden>
        RX
      </div>

      <Container className="relative grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.03fr_1fr] lg:gap-14 lg:pb-20">
        <div className="flex max-w-[620px] flex-col justify-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="label flex items-center gap-3 text-volt">
            <span className="inline-block size-1.5 rounded-full bg-volt" />
            Made to order in Porto
          </motion.p>

          <h1 className="font-display mt-5 text-[clamp(56px,9vw,110px)] uppercase leading-[0.84] tracking-[-0.06em]">
            {['Your pair.', 'Your rules.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease }}
                >
                  {i === 1 ? (
                    <>
                      your <span className="text-volt">rules.</span>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="font-script mt-4 text-[clamp(24px,3vw,32px)] text-bg/75"
          >
            nothing off the shelf
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-6 max-w-[430px] text-[16px] leading-relaxed text-bg/65"
          >
            Four house lasts, twelve leathers and a monogram if you want one. Choose every panel, and we cut, stitch and finish the pair by hand in three weeks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink to="/studio" size="lg" variant="volt" className="w-full sm:w-auto">
              Design your pair
              <ArrowRight />
            </ButtonLink>
            <ButtonLink to="/shop" size="lg" variant="ghost" className="w-full border border-bg/20 text-bg hover:bg-bg/5 sm:w-auto">
              Shop the models
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 grid max-w-[420px] grid-cols-3 gap-4 border-t border-bg/15 pt-5"
          >
            {[
              ['04', 'house lasts'],
              ['12', 'leathers'],
              ['21', 'days to make'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-[30px] leading-none tracking-[-0.05em]">{value}</dt>
                <dd className="label mt-1.5 text-[9px] text-bg/45">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="relative self-stretch"
        >
          <div className="stage-ink relative flex h-full flex-col overflow-hidden rounded-[28px] border border-bg/12 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="label text-[9px] text-bg/50">Model 01 / Axis Low</p>
              <p className="label text-[9px] text-volt">{colorway.name}</p>
            </div>

            <div className="relative flex flex-1 items-center py-2">
              <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-bg/10" aria-hidden />
              <motion.div
                key={colorway.name}
                initial={{ opacity: 0.3, scale: 0.97, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease }}
                className="relative w-full"
              >
                <Shoe
                  silhouette={product.silhouette}
                  upper={colorway.upper}
                  panel={colorway.panel}
                  sole={colorway.sole}
                  laces={colorway.laces}
                  monogram="RX"
                  label={`Axis Low in ${colorway.name}`}
                  className="mx-auto max-w-[440px]"
                  shadow={false}
                />
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bg/12 pt-4">
              <div>
                <p className="label text-[9px] text-bg/45">Choose a colourway</p>
                <div className="mt-2 flex items-center gap-2">
                  {product.colorways.map((cw) => (
                    <button
                      key={cw.name}
                      type="button"
                      onClick={() => onColorway(cw)}
                      aria-label={cw.name}
                      aria-pressed={cw.name === colorway.name}
                      className={cx(
                        'round h-7 w-7 rounded-full outline outline-1 -outline-offset-1 outline-white/25 transition-transform',
                        cw.name === colorway.name ? 'scale-110 ring-2 ring-volt ring-offset-2 ring-offset-ink' : 'hover:scale-110',
                      )}
                      style={{ background: `linear-gradient(135deg, ${cw.upper} 0 52%, ${cw.panel} 52% 76%, ${cw.sole} 76% 100%)` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[18px] tabular-nums">{money(product.price)}</p>
                <Button variant="light" onClick={add} aria-label={`Add ${product.name} to bag`}>
                  {added ? <Check /> : <Plus />}
                  {added ? 'Added' : 'Add'}
                </Button>
              </div>
            </div>
          </div>

          <div className="label absolute -left-3 bottom-16 hidden -rotate-90 origin-left text-[9px] text-bg/30 xl:block">Handmade · Resoleable · Yours</div>
        </motion.div>
      </Container>
    </section>
  )
}

function Ticker() {
  const words = ['Cut', 'Stitch', 'Last', 'Finish', 'Box', 'Ship']
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-volt py-3.5 text-ink">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={`${w}-${i}`} className="label flex items-center gap-8 text-[10px]">
            {w}
            <span className="size-1 rotate-45 bg-ink/40" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

function Collection() {
  return (
    <section className="pt-20 sm:pt-28">
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow="The collection"
            title={
              <>
                Four lasts.
                <br />
                <span className="font-script normal-case tracking-[-0.02em] text-accent">Endless pairs.</span>
              </>
            }
            action={
              <Link to="/shop" className="group inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-fg">
                Shop all models
                <span className="grid size-9 place-items-center rounded-full border border-line-strong transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            }
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
          {products.slice(0, 6).map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} priority={i < 3} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <ButtonLink to="/shop" variant="secondary" size="lg">
            See all seven models
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}

function Categories() {
  return (
    <section className="pt-20 sm:pt-28">
      <Container>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const p = bySlug(c.model)!
            const cw = p.colorways[0]
            return (
              <Reveal key={c.key} delay={i * 0.06}>
                <Link
                  to={`/shop?category=${c.key}`}
                  className="group stage relative flex aspect-[4/5] flex-col overflow-hidden rounded-image border border-line/70"
                >
                  <div className="pointer-events-none absolute inset-0 hairline-grid opacity-50" aria-hidden />
                  <div className="relative flex flex-1 items-center px-3 pt-6">
                    <Shoe {...cw} silhouette={p.silhouette} shadow={false} className="transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.04]" />
                  </div>
                  <div className="relative flex items-end justify-between gap-3 border-t border-line/70 bg-bg/55 p-4 backdrop-blur">
                    <div>
                      <p className="font-display text-[22px] uppercase leading-none">{c.label}</p>
                      <p className="mt-1.5 text-[12.5px] text-muted">{c.blurb}</p>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-bg/70 transition-transform group-hover:translate-x-0.5">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function Process() {
  const steps = [
    ['01', 'Choose a last', 'Pick one of four house silhouettes, each built on a last we have refined since 2019.'],
    ['02', 'Paint every panel', 'Upper, overlay, sole edge and laces. Twelve leathers, or a knit if you run hot.'],
    ['03', 'We make it', 'One maker, one pair, three to four weeks. We send a photograph before it is boxed.'],
  ]
  return (
    <section id="process" className="scroll-mt-24 pt-20 sm:pt-28">
      <Container>
        <div className="border-y border-line py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16">
            <Reveal>
              <p className="label text-muted">How it works</p>
              <h2 className="font-display mt-3 text-[clamp(36px,4.4vw,56px)] uppercase leading-[0.9]">
                Made once.
                <br />
                Worn for years.
              </h2>
              <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-muted">
                No warehouse, no seasons, no sizes sitting on a shelf. Your order opens a job ticket in the workshop the morning it arrives.
              </p>
              <ButtonLink to="/workshop" variant="secondary" className="mt-7">
                Inside the workshop
              </ButtonLink>
            </Reveal>
            <ol className="flex flex-col">
              {steps.map(([n, title, body], i) => (
                <Reveal key={n} delay={i * 0.08}>
                  <li className="grid grid-cols-[56px_1fr] gap-4 border-t border-line py-6 first:border-t-0 sm:grid-cols-[88px_1fr] sm:py-7">
                    <span className="font-display text-[22px] leading-none text-accent">{n}</span>
                    <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr] sm:items-start sm:gap-8">
                      <p className="text-[17px] font-medium">{title}</p>
                      <p className="text-[14.5px] leading-relaxed text-muted">{body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Materials() {
  const swatch: Record<string, string> = {
    calf: 'linear-gradient(150deg, #2a2720 0%, #1a1813 60%, #241f17 100%)',
    pebbled: 'radial-gradient(circle at 8px 8px, #3a352a 2px, transparent 2.4px), linear-gradient(150deg, #322e24, #211e17)',
    suede: 'radial-gradient(circle at 4px 4px, #3c3628 1px, transparent 1.2px), linear-gradient(150deg, #2c2a1f, #1c1a14)',
    knit: 'repeating-linear-gradient(55deg, #2b2a20 0 3px, #1d1c15 3px 6px)',
  }
  return (
    <section className="mt-20 bg-ink text-bg sm:mt-28">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.4fr] lg:gap-16">
          <Reveal>
            <p className="label text-volt">Materials</p>
            <h2 className="font-display mt-3 text-[clamp(36px,4.6vw,58px)] uppercase leading-[0.9]">
              Leather that
              <br />
              earns its scuffs.
            </h2>
            <p className="mt-5 max-w-[360px] text-[15px] leading-relaxed text-bg/60">
              We buy from two tanneries in Tuscany and one in Porto. Full-grain, vegetable-tanned, and chosen because it looks better in year three than year one.
            </p>
            <ButtonLink to="/studio" variant="volt" className="mt-7">
              Feel them in the studio
              <ArrowUpRight />
            </ButtonLink>
          </Reveal>

          <div className="grid grid-cols-2 gap-3">
            {materials.map((m, i) => (
              <Reveal key={m.key} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-card border border-bg/12 bg-bg/[0.03] p-3.5">
                  <div className="h-24 w-full rounded-[12px] border border-bg/10 sm:h-28" style={{ backgroundImage: swatch[m.key], backgroundSize: m.key === 'pebbled' || m.key === 'suede' ? '16px 16px' : undefined }} />
                  <div className="mt-3.5 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[14.5px] font-medium">{m.name}</p>
                      <p className="mt-0.5 text-[12.5px] text-bg/50">{m.note}</p>
                    </div>
                    <p className="label shrink-0 pt-1 text-[9px] text-volt">{m.price === 0 ? 'Included' : `+${money(m.price)}`}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function FieldNotes() {
  const picks = [
    { slug: 'court-01', cw: 1, note: 'Worn with a suit, then a ferry' },
    { slug: 'foundry-boot', cw: 0, note: 'Resoled twice, still going' },
    { slug: 'tempo-runner', cw: 0, note: 'Six mornings a week' },
  ]
  return (
    <section className="pt-20 sm:pt-28">
      <Container>
        <Reveal>
          <SectionTitle
            eyebrow="Field notes"
            title={
              <>
                Out of the box,
                <br />
                <span className="font-script normal-case tracking-[-0.02em] text-accent">into the world.</span>
              </>
            }
            action={<p className="max-w-[280px] text-[13.5px] leading-relaxed text-muted">A few pairs from the workshop, photographed by the people wearing them.</p>}
          />
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {picks.map((pick, i) => {
            const p = bySlug(pick.slug)!
            const cw = p.colorways[pick.cw]
            return (
              <Reveal key={pick.slug} delay={i * 0.08}>
                <Link to={`/product/${p.slug}`} className="group block">
                  <div
                    className="stage relative aspect-[4/5] overflow-hidden rounded-image border border-line/70"
                    style={{ background: `radial-gradient(80% 70% at 50% 42%, #fdfaf2, color-mix(in srgb, ${cw.upper} 16%, #ece5d7))` }}
                  >
                    <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
                    <Shoe
                      {...cw}
                      silhouette={p.silhouette}
                      monogram={i === 0 ? 'AC' : ''}
                      className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 transition-transform duration-700 group-hover:-translate-y-[54%]"
                    />
                    <p className="absolute inset-x-4 bottom-4 text-[12.5px] text-muted">{pick.note}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[14.5px] font-medium">{p.name}</p>
                    <p className="label text-[9px] text-muted">{cw.name}</p>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function Testimonials() {
  const quotes = [
    {
      quote: 'I sent a photo of a jacket and asked them to match the leather. Three weeks later the boots arrived, and the match was better than the jacket.',
      name: 'Elena M.',
      place: 'Lisbon',
    },
    {
      quote: 'Wide fit, high instep, no compromise. First pair of shoes I have owned that did not need breaking in — just wearing.',
      name: 'Tomás R.',
      place: 'Madrid',
    },
    {
      quote: 'The monogram is my grandfather’s initials. It is a small thing and I look at it every morning.',
      name: 'June K.',
      place: 'Seoul',
    },
  ]
  return (
    <section className="pt-20 sm:pt-28">
      <Container>
        <Reveal>
          <SectionTitle eyebrow="Letters" title="Worn, then written about" />
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.07}>
              <figure className="flex h-full flex-col justify-between rounded-card border border-line bg-surface p-6">
                <blockquote className="text-[15.5px] leading-relaxed text-fg/85">“{q.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center justify-between border-t border-line pt-4">
                  <span className="text-[13.5px] font-medium">{q.name}</span>
                  <span className="label text-[9px] text-muted">{q.place}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

function ClosingCTA() {
  return (
    <section className="pt-20 sm:pt-28">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-volt px-6 py-12 text-ink sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -bottom-24 -right-10 select-none font-display text-[300px] leading-none tracking-[-0.08em] text-ink/[0.06]" aria-hidden>
            R
          </div>
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-ink/60">The studio is open</p>
              <h2 className="font-display mt-3 text-[clamp(44px,7vw,84px)] uppercase leading-[0.86]">
                Make them
                <br />
                yours.
              </h2>
              <p className="mt-5 max-w-[380px] text-[14.5px] leading-relaxed text-ink/70">
                Start from a model or a blank last. Twelve colours, four leathers, a width that actually fits and three letters if you want them.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/studio" size="lg" className="w-full bg-ink text-bg hover:bg-ink-2 sm:w-auto">
                Open the studio
                <ArrowRight />
              </ButtonLink>
              <ButtonLink to="/shop" size="lg" variant="secondary" className="w-full border-ink/30 text-ink hover:border-ink sm:w-auto">
                Shop models
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

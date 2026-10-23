import { Check, Lock } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'

import { colourName, materialOf } from '../../data/products'
import { money, useCart } from '../lib/cart'
import { Shoe } from '../components/Shoe'
import { Button, ButtonLink, Container, inputClass } from '../components/ui'

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-[12.5px] font-medium">{label}</span>
      {children}
    </label>
  )
}

export function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', first: '', last: '', address: '', city: '', postcode: '', country: 'United States' })
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState(false)

  if (cart.items.length === 0 && !placed) return <Navigate to="/shop" replace />

  const total = cart.subtotal
  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: `${form.first} ${form.last}`.trim(),
          items: cart.items.map((i) => ({ id: i.slug, custom: i.custom, quantity: i.quantity })),
        }),
      })
      const body = (await response.json()) as { reference?: string; error?: string }
      if (!response.ok || !body.reference) throw new Error(body.error ?? 'Something went wrong.')
      const summary = { reference: body.reference, email: form.email, total, items: cart.items }
      setPlaced(true)
      cart.clear()
      navigate(`/order/${body.reference}`, { state: summary })
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <Container className="pt-8 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-muted">Checkout / Step 2 of 2</p>
          <h1 className="font-display mt-2 text-[clamp(40px,6vw,64px)] uppercase leading-[0.88]">Almost yours</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2">
          <span className="size-1.5 rounded-full bg-accent" />
          <p className="text-[12px] text-muted">Your maker starts within 48 hours of this order</p>
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <form onSubmit={submit} className="flex flex-col gap-9">
          <section>
            <div className="flex items-baseline gap-3">
              <span className="label text-[9px] text-accent">01</span>
              <h2 className="text-[16px] font-medium">Contact</h2>
            </div>
            <Field label="Email" className="mt-4 block">
              <input type="email" required className={inputClass} value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" />
            </Field>
            <p className="mt-2 text-[12px] text-muted">Order updates and the photograph of your pair before it ships.</p>
          </section>

          <section>
            <div className="flex items-baseline gap-3">
              <span className="label text-[9px] text-accent">02</span>
              <h2 className="text-[16px] font-medium">Shipping</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="First name">
                <input required className={inputClass} value={form.first} onChange={set('first')} autoComplete="given-name" />
              </Field>
              <Field label="Last name">
                <input required className={inputClass} value={form.last} onChange={set('last')} autoComplete="family-name" />
              </Field>
              <Field label="Address" className="col-span-2">
                <input required className={inputClass} value={form.address} onChange={set('address')} autoComplete="street-address" />
              </Field>
              <Field label="City">
                <input required className={inputClass} value={form.city} onChange={set('city')} autoComplete="address-level2" />
              </Field>
              <Field label="Postcode">
                <input required className={inputClass} value={form.postcode} onChange={set('postcode')} autoComplete="postal-code" />
              </Field>
              <Field label="Country" className="col-span-2">
                <select className={inputClass} value={form.country} onChange={set('country')} autoComplete="country-name">
                  {['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Netherlands', 'Portugal', 'Australia', 'Japan', 'South Korea'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-[12px] border border-line bg-surface px-4 py-3 text-[13px]">
              <span>Worldwide, tracked, carbon-neutral</span>
              <span className="text-muted">Free</span>
            </div>
          </section>

          <section>
            <div className="flex items-baseline gap-3">
              <span className="label text-[9px] text-accent">03</span>
              <h2 className="text-[16px] font-medium">Payment</h2>
            </div>
            <div className="mt-4 rounded-card border border-line bg-surface p-5">
              <div className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                <Lock className="mt-0.5 size-4 shrink-0" />
                <span>
                  This is a demo checkout. No card is charged. Connect Stripe in <code className="rounded-[5px] bg-surface-2 px-1.5 py-0.5 text-[12px]">src/worker/index.ts</code> to take payments.
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 opacity-60">
                <input disabled placeholder="Card number" className={`${inputClass} col-span-2`} />
                <input disabled placeholder="MM / YY" className={inputClass} />
                <input disabled placeholder="CVC" className={inputClass} />
              </div>
            </div>
          </section>

          {state === 'error' && <p className="text-[14px] text-accent">{error}</p>}

          <div>
            <Button type="submit" size="lg" loading={state === 'sending'} className="w-full sm:w-auto">
              Place order · {money(total)}
            </Button>
            <p className="mt-3 text-[12px] text-muted">Made to order in Porto. You can change the design within 24 hours of ordering — just reply to the email.</p>
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-medium">Your pairs</h2>
              <span className="label text-[9px] text-muted">{cart.count} {cart.count === 1 ? 'item' : 'items'}</span>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4 first:pt-0">
                  <div className="stage size-[72px] shrink-0 overflow-hidden rounded-[12px] border border-line/70">
                    <Shoe {...item.custom} silhouette={item.product.silhouette} shadow={false} className="p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium">{item.product.name}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-muted">
                      {colourName(item.custom.upper)} · {materialOf(item.custom.material).name} · {item.custom.size}
                    </p>
                    <p className="truncate text-[11.5px] text-muted">
                      {item.custom.width === 'wide' ? 'Wide · ' : ''}
                      {item.custom.monogram ? `“${item.custom.monogram.toUpperCase()}” · ` : ''}
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-[13px] tabular-nums">{money(item.unitPrice * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{money(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>Free</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Duties and taxes</dt>
                <dd>Included</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-[16px] font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{money(total)}</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-[12px] bg-surface-2/70 px-3.5 py-3 text-[12px] leading-relaxed text-muted">
              Your pairs are cut after you order. Most arrive in 3–4 weeks; we email when the box leaves Porto.
            </div>
          </div>
          <Link to="/shop" className="mt-4 block text-center text-[13px] text-muted underline-offset-4 hover:text-fg hover:underline">
            Add another pair
          </Link>
        </aside>
      </div>
    </Container>
  )
}

export function OrderConfirmed() {
  const { state } = useLocation() as { state?: { reference: string; email: string; total: number } }
  return (
    <Container className="pt-14 sm:pt-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="round mx-auto grid size-14 place-items-center rounded-full bg-volt text-ink">
          <Check className="size-6" />
        </span>
        <p className="label mt-6 text-accent">Order received</p>
        <h1 className="font-display mt-2 text-[clamp(44px,7vw,68px)] uppercase leading-[0.88]">Thank you</h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
          {state ? (
            <>
              Order <span className="font-medium text-fg">{state.reference}</span> is with the workshop. A confirmation is heading to {state.email}. We start cutting this week and send a photograph before it ships.
            </>
          ) : (
            'Your order is confirmed and heading to the workshop.'
          )}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <ButtonLink to="/studio">Design another pair</ButtonLink>
          <ButtonLink to="/shop" variant="secondary">
            Back to the collection
          </ButtonLink>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-3 border-t border-line pt-6 text-left">
          {[
            ['Cut', 'This week'],
            ['Finished', 'In 3–4 weeks'],
            ['Shipping', 'Free, tracked'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="label text-[9px] text-muted">{label}</p>
              <p className="mt-1 text-[13px]">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[13px] text-faint">
          Questions? <Link to="/workshop" className="underline underline-offset-4 hover:text-fg">Write to the workshop</Link>
        </p>
      </div>
    </Container>
  )
}

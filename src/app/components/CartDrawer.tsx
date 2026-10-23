import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

import { colourName, materialOf } from '../../data/products'
import { money, useCart } from '../lib/cart'
import { Shoe } from './Shoe'
import { Button } from './ui'

export function CartDrawer() {
  const cart = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!cart.open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cart])

  return (
    <AnimatePresence>
      {cart.open && (
        <motion.div
          className="fixed inset-0 z-50 bg-fg/35 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && cart.setOpen(false)}
        >
          <motion.aside
            role="dialog"
            aria-label="Your bag"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-2 right-2 flex w-[calc(100%-16px)] max-w-[460px] flex-col rounded-dialog bg-bg shadow-drawer"
          >
            <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-line px-6">
              <h2 className="font-display text-[26px] uppercase leading-none">
                Your bag {cart.count > 0 && <span className="ml-1.5 font-sans text-[13px] font-medium tracking-normal text-muted">{cart.count}</span>}
              </h2>
              <button type="button" aria-label="Close bag" onClick={() => cart.setOpen(false)} className="grid size-10 place-items-center rounded-control transition-colors hover:bg-surface-2">
                <X className="size-5" />
              </button>
            </header>

            {cart.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-surface-2">
                  <ShoppingBag className="size-5 text-muted" />
                </span>
                <p className="font-display mt-5 text-[30px] uppercase leading-none">Nothing here yet</p>
                <p className="mt-2 max-w-[240px] text-[14px] leading-relaxed text-muted">Start with a model, then make every panel yours.</p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Button onClick={() => { cart.setOpen(false); navigate('/studio') }}>
                    <Sparkles />
                    Open the studio
                  </Button>
                  <Button variant="secondary" onClick={() => { cart.setOpen(false); navigate('/shop') }}>
                    Browse models
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-6 py-2.5">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                  <p className="label text-[9.5px] text-muted">Made to order · ships in 3–4 weeks · free worldwide</p>
                </div>

                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={() => cart.setOpen(false)}
                            className="stage size-[92px] shrink-0 overflow-hidden rounded-[16px] border border-line/70"
                          >
                            <Shoe {...item.custom} silhouette={item.product.silhouette} shadow={false} className="p-1.5" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-[14.5px] font-medium">{item.product.name}</p>
                                <p className="mt-0.5 truncate text-[12.5px] text-muted">
                                  {colourName(item.custom.upper)} · {materialOf(item.custom.material).name}
                                </p>
                                <p className="truncate text-[12.5px] text-muted">
                                  {item.custom.size}
                                  {item.custom.width === 'wide' ? ' · Wide' : ''}
                                  {item.custom.monogram ? ` · “${item.custom.monogram.toUpperCase()}”` : ''}
                                </p>
                              </div>
                              <p className="shrink-0 text-[14px] tabular-nums">{money(item.unitPrice * item.quantity)}</p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center gap-2">
                                <div className="grid h-8 grid-cols-[32px_30px_32px] items-center rounded-[9px] border border-line-strong text-[13px]">
                                  <button type="button" aria-label="Decrease" onClick={() => cart.setQuantity(item.id, item.quantity - 1)} className="h-full text-muted hover:text-fg">
                                    −
                                  </button>
                                  <span className="text-center tabular-nums">{item.quantity}</span>
                                  <button type="button" aria-label="Increase" onClick={() => cart.setQuantity(item.id, item.quantity + 1)} className="h-full text-muted hover:text-fg">
                                    +
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[item.custom.upper, item.custom.panel, item.custom.sole].map((c, i) => (
                                    <span key={i} className="size-2.5 rounded-full ring-1 ring-inset ring-fg/15" style={{ backgroundColor: c }} title={colourName(c)} />
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => cart.remove(item.id)}
                                className="text-[12.5px] text-muted underline-offset-4 hover:text-fg hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-line px-6 py-5">
                  <div className="flex items-center justify-between text-[15px]">
                    <span className="text-muted">Subtotal</span>
                    <span className="tabular-nums">{money(cart.subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-faint">Shipping, duties and taxes included. Made in Porto.</p>
                  <Button
                    size="lg"
                    className="mt-4 w-full"
                    onClick={() => {
                      cart.setOpen(false)
                      navigate('/checkout')
                    }}
                  >
                    Checkout
                    <ArrowRight />
                  </Button>
                  <button type="button" onClick={() => cart.setOpen(false)} className="mt-3 w-full text-center text-[13px] text-muted hover:text-fg">
                    Continue browsing
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

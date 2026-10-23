import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import { useCart } from '../lib/cart'
import { cx } from '../lib/cx'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/studio', label: 'Studio' },
  { to: '/workshop', label: 'Workshop' },
]

const ticker = [
  'Made to order in Porto',
  'Ships in 3–4 weeks',
  'Free worldwide shipping',
  'Resole for life',
  'Monogram included on request',
]

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cx('group inline-flex items-baseline gap-2.5', className)} aria-label="Raxx home">
      <span className="font-display text-[26px] uppercase leading-none tracking-[-0.08em]">
        Raxx<span className="text-accent">.</span>
      </span>
      {!compact && <span className="label hidden text-[9px] text-muted sm:inline">Custom footwear</span>}
    </Link>
  )
}

export function Nav() {
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="relative flex h-9 items-center overflow-hidden bg-fg text-bg">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap pl-10">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={`${item}-${i}`} className="label flex items-center gap-10 text-[9.5px] text-bg/75">
              {item}
              <span className="size-1 rounded-full bg-volt" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <header
        className={cx(
          'sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300',
          scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-xl' : 'border-b border-transparent bg-bg',
        )}
      >
        <div className="mx-auto grid h-[66px] max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8">
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cx('inline-flex h-9 items-center rounded-[10px] px-3 text-[14px] transition-colors hover:bg-surface-2', isActive ? 'text-fg' : 'text-muted hover:text-fg')
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/#process" className="inline-flex h-9 items-center rounded-[10px] px-3 text-[14px] text-muted transition-colors hover:bg-surface-2 hover:text-fg">
              How it works
            </Link>
          </nav>
          <button type="button" aria-label="Menu" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-control lg:hidden">
            <Menu className="size-5" />
          </button>

          <Logo />

          <div className="flex items-center justify-end gap-1">
            <Link
              to="/studio"
              className="mr-1 hidden h-9 items-center gap-1 rounded-[10px] px-3 text-[13.5px] text-muted transition-colors hover:bg-surface-2 hover:text-fg sm:inline-flex"
            >
              Design yours
              <ArrowUpRight className="size-3.5" />
            </Link>
            <button
              type="button"
              aria-label={`Bag, ${cart.count} ${cart.count === 1 ? 'pair' : 'pairs'}`}
              onClick={() => cart.setOpen(true)}
              className="relative inline-flex h-10 items-center gap-2 rounded-control px-3 text-[14px] transition-colors hover:bg-surface-2"
            >
              <ShoppingBag className="size-[18px]" />
              <span className="hidden sm:inline">Bag</span>
              <AnimatePresence>
                {cart.count > 0 && (
                  <motion.span
                    key={cart.count}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="round grid min-w-5 place-items-center rounded-full bg-volt px-1.5 text-[11px] font-semibold tabular-nums text-ink"
                  >
                    {cart.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-fg/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.nav
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-2 left-2 flex w-[min(330px,calc(100%-16px))] flex-col rounded-dialog bg-bg p-5 shadow-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-control hover:bg-surface-2">
                  <X className="size-5" />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-1">
                {links.map((l, i) => (
                  <li key={l.to}>
                    <Link to={l.to} className="flex h-14 items-center justify-between rounded-control px-3 hover:bg-surface-2">
                      <span className="font-display text-[30px] uppercase leading-none">{l.label}</span>
                      <span className="label text-[10px] text-faint">0{i + 1}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-line pt-5">
                <p className="label text-[10px] text-muted">Made to order in Porto</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">One pair at a time, 3–4 weeks from your order, free shipping worldwide.</p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

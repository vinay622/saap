import { ArrowRight } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { Container } from './ui'
import { Logo } from './Nav'

const columns = [
  {
    title: 'Shop',
    links: [
      ['All models', '/shop'],
      ['Low tops', '/shop?category=low'],
      ['Runners', '/shop?category=run'],
      ['Boots', '/shop?category=boot'],
      ['Slip-ons', '/shop?category=slip'],
    ],
  },
  {
    title: 'Help',
    links: [
      ['Shipping', '/workshop'],
      ['Returns & remakes', '/workshop'],
      ['Resoling', '/workshop'],
      ['Size guide', '/studio'],
      ['Contact', '/workshop'],
    ],
  },
  {
    title: 'Workshop',
    links: [
      ['Our story', '/workshop'],
      ['Materials', '/#process'],
      ['The studio', '/studio'],
      ['How it works', '/#process'],
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('sending')
    const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) })
    setState(response.ok ? 'done' : 'error')
  }

  return (
    <footer className="mt-24 bg-ink text-bg">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="max-w-md">
            <p className="label text-volt">Bench notes</p>
            <h2 className="font-display mt-3 text-[clamp(30px,4vw,42px)] uppercase leading-[0.95]">One letter a month, from the bench.</h2>
            <p className="mt-3 text-[14px] text-bg/55">New colourways, open days, the occasional pair that did not pass inspection.</p>
            {state === 'done' ? (
              <p className="mt-6 inline-flex h-12 items-center rounded-control bg-bg/10 px-5 text-[14px]">Thank you. Watch your inbox.</p>
            ) : (
              <form onSubmit={submit} className="mt-6 flex max-w-[380px] gap-2">
                <label className="sr-only" htmlFor="newsletter">
                  Email
                </label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full min-w-0 rounded-control border border-bg/20 bg-bg/[0.04] px-4 text-[14px] text-bg placeholder:text-bg/35 focus:border-bg/60 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  disabled={state === 'sending'}
                  className="grid size-12 shrink-0 place-items-center rounded-control bg-volt text-ink transition-colors hover:bg-[#d6ff62] disabled:opacity-60"
                >
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}
            {state === 'error' && <p className="mt-2 text-[12.5px] text-volt">Enter a valid email address.</p>}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="label text-[9px] text-bg/40">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={to} className="text-[13.5px] text-bg/70 transition-colors hover:text-bg">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-bg/15 pt-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[12px] text-bg/45">© {new Date().getFullYear()} Raxx. Made one pair at a time in Porto.</p>
            <p className="mt-1 text-[11px] text-bg/25">Shoe illustrations adapted from Noto Emoji, Apache License 2.0.</p>
          </div>
          <div className="flex items-center gap-5">
            <p className="label hidden text-[9px] text-bg/30 sm:block">Resole for life</p>
            <Logo className="text-bg" compact />
          </div>
        </div>
      </Container>
    </footer>
  )
}

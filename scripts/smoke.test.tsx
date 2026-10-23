import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register({ url: 'http://localhost:3000/' })

// Happy DOM is missing a few browser APIs that motion and the app touch.
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as never
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.ResizeObserver = Observer as never
globalThis.IntersectionObserver = Observer as never
window.scrollTo = (() => {}) as never
Element.prototype.scrollIntoView = (() => {}) as never
Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true })

const { afterEach, beforeEach, expect, test } = await import('bun:test')
const { cleanup, render, screen, waitFor } = await import('@testing-library/react')
const userEvent = (await import('@testing-library/user-event')).default
const { App } = await import('../src/app/App')
const { MotionGlobalConfig } = await import('motion/react')
MotionGlobalConfig.skipAnimations = true

beforeEach(() => {
  localStorage.clear()
  window.history.pushState({}, '', '/')
})

afterEach(cleanup)

test('home renders the hero and collection', async () => {
  render(<App />)
  expect(await screen.findByRole('heading', { name: /your pair/i })).toBeTruthy()
  expect(screen.getAllByRole('heading', { name: /axis low/i }).length).toBeGreaterThan(0)
  expect(screen.getByText(/design your pair/i)).toBeTruthy()
})

test('studio recolours the shoe, adds a monogram and a bag line', async () => {
  const user = userEvent.setup()
  window.history.pushState({}, '', '/studio?model=axis-low')
  render(<App />)

  await screen.findByRole('heading', { name: /make it yours/i })

  const art = () => document.querySelector('svg[viewBox="0 0 128 128"]')?.outerHTML ?? ''
  expect(art()).toContain('#e5dcc9')

  await user.click(screen.getByRole('button', { name: 'Upper: Wine' }))
  await waitFor(() => expect(art()).toContain('#5c2231'))

  const monogram = screen.getByLabelText(/monogram, up to three characters/i)
  await user.type(monogram, 'ak')
  await waitFor(() => expect(monogram).toHaveProperty('value', 'AK'))
  await waitFor(() => expect(document.body.textContent).toContain('$263'))

  const add = screen.getAllByRole('button', { name: /add to bag · \$263/i })[0]
  await user.click(add)

  await waitFor(() => expect(localStorage.getItem('raxx-bag-v1') ?? '').toContain('AK'))
  const stored = JSON.parse(localStorage.getItem('raxx-bag-v1') ?? '[]')
  expect(stored[0].custom.upper).toBe('#5c2231')
  expect(stored[0].custom.monogram).toBe('AK')

  expect(await screen.findByRole('dialog', { name: /your bag/i })).toBeTruthy()
  expect(screen.getAllByText(/axis low/i).length).toBeGreaterThan(0)
})

test('checkout places the order and shows the reference', async () => {
  const user = userEvent.setup()
  localStorage.setItem(
    'raxx-bag-v1',
    JSON.stringify([
      {
        id: 'line-1',
        slug: 'axis-low',
        quantity: 1,
        custom: {
          upper: '#e5dcc9',
          panel: '#191813',
          sole: '#f5f1e6',
          laces: '#191813',
          material: 'calf',
          size: 'US 9',
          width: 'standard',
          monogram: 'RX',
        },
      },
    ]),
  )
  globalThis.fetch = (async (input: string | URL | Request) => {
    if (String(input).includes('/api/orders')) {
      return new Response(JSON.stringify({ reference: 'RX-TEST1' }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response('{}', { status: 200 })
  }) as typeof fetch

  window.history.pushState({}, '', '/checkout')
  render(<App />)

  await screen.findByRole('heading', { name: /almost yours/i })
  await user.type(screen.getAllByLabelText('Email')[0], 'test@raxx.com')
  await user.type(screen.getByLabelText('First name'), 'Ada')
  await user.type(screen.getByLabelText('Last name'), 'Lovelace')
  await user.type(screen.getByLabelText('Address'), '1 Rua da Alegria')
  await user.type(screen.getByLabelText('City'), 'Porto')
  await user.type(screen.getByLabelText('Postcode'), '4000-011')
  await user.click(screen.getByRole('button', { name: /place order/i }))

  await screen.findByRole('heading', { name: /thank you/i })
  expect(screen.getByText('RX-TEST1')).toBeTruthy()
  expect(localStorage.getItem('raxx-bag-v1')).toBe('[]')
})

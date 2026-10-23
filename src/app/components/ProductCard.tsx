import { motion } from 'motion/react'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { defaultCustom, type Product } from '../../data/products'
import { money, useCart } from '../lib/cart'
import { cx } from '../lib/cx'
import { Shoe } from './Shoe'

export function ProductCard({ product, index = 0, priority }: { product: Product; index?: number; priority?: boolean }) {
  const cart = useCart()
  const [added, setAdded] = useState(false)
  const custom = defaultCustom(product)
  const tint = product.colorways[0].upper

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    cart.add(product, custom)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.7, delay: priority ? 0 : (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div
          className="stage relative aspect-square overflow-hidden rounded-image border border-line/70"
          style={{ background: `radial-gradient(70% 66% at 50% 40%, #fdfaf2 0%, ${`color-mix(in srgb, ${tint} 12%, #efe9dc)`} 78%)` }}
        >
          <div className="absolute inset-0 hairline-grid opacity-40" aria-hidden />
          <span className="absolute left-4 top-4 z-10">
            {product.badge && (
              <span
                className={cx(
                  'label rounded-[7px] px-2 py-[5px] text-[9px] tracking-[0.12em]',
                  product.badge === 'Low stock' ? 'bg-accent text-bg' : product.badge === 'New' ? 'bg-volt text-ink' : 'bg-bg/90 text-fg backdrop-blur',
                )}
              >
                {product.badge}
              </span>
            )}
          </span>

          <Shoe
            {...custom}
            silhouette={product.silhouette}
            monogram={product.slug === 'axis-low' ? 'RX' : ''}
            className="relative z-[1] p-5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.03] sm:p-7"
            label={`${product.name} in ${product.colorways[0].name}`}
          />

          <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-bg/80 px-2.5 py-2 backdrop-blur">
              {product.colorways.map((cw) => (
                <span
                  key={cw.name}
                  title={cw.name}
                  className="size-3 rounded-full ring-1 ring-inset ring-fg/15"
                  style={{ backgroundColor: cw.upper }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`Add ${product.name} to bag`}
              className={cx(
                'grid size-10 shrink-0 place-items-center rounded-full border border-line bg-bg/90 text-fg shadow-soft backdrop-blur transition-[background-color,color,border-color,transform] duration-200 hover:scale-105',
                added && 'border-volt bg-volt',
              )}
            >
              {added ? <Check className="size-4" /> : <Plus className="size-4" />}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium tracking-[-0.01em]">{product.name}</h3>
            <p className="mt-0.5 truncate text-[13px] text-muted">{product.short}</p>
          </div>
          <p className="shrink-0 text-[15px] tabular-nums">{money(product.price)}</p>
        </div>
      </Link>
    </motion.article>
  )
}

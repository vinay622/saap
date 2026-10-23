# Raxx

A made-to-order footwear storefront. Four house lasts, twelve leathers and a
live studio where every panel of the shoe is recoloured in place: upper,
overlay, sole and laces, plus material, width, size and a three-letter
monogram. The bag, checkout and confirmation all carry the full custom spec.

## Run it

```sh
bun install
bun run dev        # http://localhost:5173
bun run build      # dist/client (assets) + dist/store/index.js (Worker)
bun run typecheck
bun run test       # DOM smoke tests (home, studio, bag, checkout)
```

## What is where

- `src/data/products.ts` — the seven models, their house colourways, the
  swatch book, materials, widths, sizes and the price rules
  (`customPrice` adds material, wide-width and monogram upcharges).
- `src/app/components/Shoe.tsx` — the live shoe. It takes the custom spec,
  shades the four colours, applies a material filter and overlays the
  monogram.
- `src/app/components/shoeArt.ts` — generated, recolourable SVG art with
  `{{upper}}`, `{{panel}}`, `{{sole}}`, `{{laces}}` tokens. Regenerate with
  `python3 scripts/gen-shoe-art.py` after editing the sources in
  `scripts/noto/`.
- `src/app/pages/Studio.tsx` — the configurator. The design is encoded in the
  URL (`?model=axis-low&u=…&p=…&s=…&l=…&material=…&size=…&width=…&mono=…`), so
  a link is a saved design.
- `src/app/lib/cart.tsx` — bag lines keyed by the complete spec, persisted to
  `localStorage` under `raxx-bag-v1`.
- `src/app/pages/*` — home, shop, product, studio, workshop, checkout and
  confirmation.
- `src/worker/index.ts` — `/api/orders` and `/api/newsletter`. The checkout is
  a demo: swap the order handler for a Stripe Checkout session (secret in
  Sites → Secrets) or persist orders to D1.

## Design

Bone paper (`#f2eee4`), ink (`#14130e`) and a single volt accent, with clay for
editorial marks. Archivo for display and labels, Inter for text, Instrument
Serif italic for the asides. The shoe stages use a warm radial light and a
hairline grid so the art sits in a place rather than floating.

## Art credit

Shoe illustrations are adapted from [Noto Emoji](https://github.com/googlefonts/noto-emoji)
by Google Inc, licensed under the Apache License 2.0. They are recoloured at
runtime; the original SVGs live in `scripts/noto/`.

## Deploy with Freebuff Sites

`deploy.json` points at the build output. After `bun run build`, deploy with
`sites_deploy` from this directory.

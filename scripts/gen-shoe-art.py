#!/usr/bin/env python3
"""Generate src/app/components/shoeArt.ts from the Noto Emoji SVGs.

Source: Noto Emoji (Google Inc), Apache License 2.0.
The SVGs are recoloured at runtime by swapping {{upper}}, {{panel}} and friends
for the customer's chosen colours.

Run from the repo root:  python3 scripts/gen-shoe-art.py
Source SVGs are vendored in scripts/noto (from https://api.iconify.design/noto/).
"""

import json
import re
from pathlib import Path

SRC = Path('scripts/noto')
OUT = Path('src/app/components/shoeArt.ts')

# (attribute, original colour) -> token
MAPS = {
    'runner': {
        ('fill', '#0277bd'): 'upper',
        ('fill', '#03a9f4'): 'panel',
        ('fill', '#004a7c'): 'dark',
        ('fill', '#37474f'): 'darker',
        ('fill', '#90a4ae'): 'darker',
        ('fill', '#e0e0e0'): 'sole',
        ('fill', '#bdbdbd'): 'soleShadow',
        ('fill', '#82aec0'): 'soleShadow',
        ('stroke', '#9e9e9e'): 'laceShadow',
        ('stroke', '#e0e0e0'): 'laces',
    },
    'court': {
        ('fill', '#263238'): 'darker',
        ('stroke', '#263238'): 'laceShadow',
        ('fill', '#4e342e'): 'sole',
        ('fill', '#a06841'): 'upper',
        ('fill', '#784d30'): 'panel',
        ('fill', '#f29657'): 'panel',
    },
    'boot': {
        ('fill', '#263238'): 'darker',
        ('fill', '#784d30'): 'upper',
        ('fill', '#a06841'): 'panel',
        ('fill', '#e2a610'): 'sole',
        ('stroke', '#c62828'): 'laceShadow',
        ('stroke', '#f44336'): 'laces',
        ('fill', '#78a3ac'): 'metal',
        ('fill', '#4e342e'): 'dark',
    },
    'slip': {
        ('fill', '#263238'): 'darker',
        ('fill', '#0071af'): 'dark',
        ('fill', '#008ec9'): 'upper',
        ('stop-color', '#26bfff'): 'panel',
        ('fill', '#874d36'): 'sole',
        ('fill', '#26bfff'): 'panel',
    },
}

SOURCES = {
    'runner': 'noto-running-shoe.svg',
    'court': 'noto-mans-shoe.svg',
    'boot': 'noto-hiking-boot.svg',
    'slip': 'noto-flat-shoe.svg',
}

lines = [
    '// Shoe illustrations adapted from Noto Emoji (Google Inc), Apache License 2.0.',
    '// https://github.com/googlefonts/noto-emoji',
    '// Colour tokens are replaced at runtime with the customer\'s spec.',
    '',
    'import type { Silhouette } from \'../../data/products\'',
    '',
    'export const shoeArt: Record<Silhouette, string> = {',
]

for key, filename in SOURCES.items():
    raw = (SRC / filename).read_text()
    inner = re.sub(r'^\s*<svg[^>]*>', '', raw)
    inner = inner.replace('</svg>', '').strip()
    inner = re.sub(r'(id="|href="#)(SVG[\w-]+)', r'\1{{uid}}', inner)
    inner = re.sub(r'(url\(#)(SVG[\w-]+)', r'\1{{uid}}', inner)
    for (attr, hexcode), token in MAPS[key].items():
        inner = inner.replace(f'{attr}="{hexcode}"', f'{attr}="{{{{{token}}}}}"')
    leftover = sorted(set(re.findall(r'#[0-9a-fA-F]{6}', inner)))
    if leftover:
        raise SystemExit(f'{key}: unmapped colours {leftover}')
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%" '
        'aria-hidden="true" focusable="false">' + inner + '</svg>'
    )
    lines.append(f'  {key}: {json.dumps(svg)},')

lines.append('}')
OUT.write_text('\n'.join(lines) + '\n')
print(f'wrote {OUT} ({OUT.stat().st_size} bytes)')

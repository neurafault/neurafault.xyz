import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pub = resolve(root, 'public');

// ── Favicon PNGs ──────────────────────────────────────────
const faviconSvg = readFileSync(resolve(pub, 'favicon.svg'));
const sizes = [16, 32, 48, 180, 192, 512];

for (const s of sizes) {
  const name = s === 180 ? 'apple-touch-icon.png' : s <= 48 ? `favicon-${s}.png` : `icon-${s}.png`;
  const dir = s <= 48 || s === 180 ? pub : resolve(pub, 'icons');
  mkdirSync(dir, { recursive: true });
  await sharp(faviconSvg).resize(s, s).png().toFile(resolve(dir, name));
  console.log(`✓ ${name} (${s}x${s})`);
}

// Copy 32px to root as well for compat
await sharp(faviconSvg).resize(32, 32).png().toFile(resolve(pub, 'favicon-32.png'));

// ── OG Banner — Main Site ─────────────────────────────────
const W = 1200, H = 630;

function createOgSvg({ title, subtitle, accent = '#4ade80' }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <!-- Border -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="8" fill="none" stroke="${accent}" stroke-width="1" opacity="0.15"/>
  <!-- Prompt line -->
  <text x="60" y="120" font-family="'Courier New',monospace" font-size="20" fill="#555">$ cat ./readme</text>
  <!-- Title -->
  <text x="60" y="260" font-family="'Courier New',monospace" font-size="64" font-weight="bold" fill="${accent}">${escSvg(title)}</text>
  <!-- Subtitle -->
  <text x="60" y="340" font-family="'Courier New',monospace" font-size="26" fill="#a0a0a0">${escSvg(subtitle)}</text>
  <!-- Cursor blink -->
  <rect x="60" y="420" width="16" height="28" fill="${accent}" opacity="0.7"/>
  <!-- Domain -->
  <text x="${W - 60}" y="${H - 50}" text-anchor="end" font-family="'Courier New',monospace" font-size="20" fill="#555">neurafault.xyz</text>
  <!-- Scanlines -->
  ${Array.from({ length: 20 }, (_, i) =>
    `<rect x="0" y="${i * 32}" width="${W}" height="1" fill="#fff" opacity="0.015"/>`
  ).join('\n  ')}
</svg>`);
}

function escSvg(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Main site OG
await sharp(createOgSvg({
  title: 'Neurafault',
  subtitle: 'Breaking AI before it breaks you.',
})).png().toFile(resolve(pub, 'og-default.png'));
console.log('✓ og-default.png (1200x630)');

// Docs OG
await sharp(createOgSvg({
  title: 'Neurafault Docs',
  subtitle: 'AI Security Research — notes, methodology, tools.',
})).png().toFile(resolve(pub, 'og-docs.png'));
console.log('✓ og-docs.png (1200x630)');

console.log('\nDone! All assets generated.');

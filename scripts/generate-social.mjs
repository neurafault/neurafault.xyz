import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = resolve(root, 'social-assets');
mkdirSync(out, { recursive: true });

const ACCENT = '#4ade80';
const BG = '#0d0d0d';
const TEXT = '#e0e0e0';
const MUTED = '#666666';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Avatar (1000x1000) ───────────────────────────────────
// The fault-line "N" — same concept as favicon but high-res
const avatarSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <defs>
    <clipPath id="top"><rect x="0" y="0" width="1000" height="488"/></clipPath>
    <clipPath id="bottom"><rect x="0" y="512" width="1000" height="488"/></clipPath>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1000" height="1000" rx="120" fill="${BG}"/>
  <g clip-path="url(#top)" filter="url(#glow)">
    <text x="488" y="700" text-anchor="middle" font-family="'Courier New',monospace" font-size="660" font-weight="bold" fill="${ACCENT}">N</text>
  </g>
  <g clip-path="url(#bottom)" filter="url(#glow)">
    <text x="512" y="700" text-anchor="middle" font-family="'Courier New',monospace" font-size="660" font-weight="bold" fill="${ACCENT}">N</text>
  </g>
  <line x1="140" y1="500" x2="860" y2="500" stroke="${ACCENT}" stroke-width="2" opacity="0.2"/>
  <rect x="660" y="492" width="90" height="4" rx="2" fill="${ACCENT}" opacity="0.3"/>
  <rect x="250" y="508" width="60" height="3" rx="1" fill="${ACCENT}" opacity="0.2"/>
</svg>`);

// Generate avatar at multiple sizes
const avatarSizes = [
  { name: 'avatar-1000.png', size: 1000 },
  { name: 'avatar-800.png', size: 800 },
  { name: 'avatar-512.png', size: 512 },
  { name: 'avatar-400.png', size: 400 },
  { name: 'avatar-200.png', size: 200 },
];

for (const { name, size } of avatarSizes) {
  await sharp(avatarSvg).resize(size, size).png().toFile(resolve(out, name));
  console.log(`✓ ${name}`);
}

// ── Banner generator ─────────────────────────────────────
function createBanner(w, h, { subtitle = 'AI Security Research' } = {}) {
  // Calculate font sizes proportionally
  const titleSize = Math.round(h * 0.13);
  const subSize = Math.round(h * 0.055);
  const taglineSize = Math.round(h * 0.04);
  const padX = Math.round(w * 0.05);
  const centerY = Math.round(h * 0.5);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${BG}"/>

  <!-- Subtle gradient -->
  <defs>
    <radialGradient id="bg-glow" cx="30%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg-glow)"/>

  <!-- Border line top & bottom -->
  <line x1="0" y1="0" x2="${w}" y2="0" stroke="${ACCENT}" stroke-width="2" opacity="0.3"/>
  <line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="${ACCENT}" stroke-width="2" opacity="0.3"/>

  <!-- Brand name -->
  <text x="${padX}" y="${centerY - titleSize * 0.3}" font-family="'Courier New',monospace" font-size="${titleSize}" font-weight="bold" fill="${TEXT}">neurafault</text>

  <!-- Subtitle -->
  <text x="${padX}" y="${centerY + subSize * 1.2}" font-family="'Courier New',monospace" font-size="${subSize}" fill="${ACCENT}">${esc(subtitle)}</text>

  <!-- Tagline -->
  <text x="${padX}" y="${centerY + subSize * 1.2 + taglineSize * 1.8}" font-family="'Courier New',monospace" font-size="${taglineSize}" fill="${MUTED}">Breaking AI before it breaks you.</text>

  <!-- Decorative dots (particle-like) -->
  ${Array.from({ length: 12 }, () => {
    const cx = Math.round(w * 0.55 + Math.random() * w * 0.4);
    const cy = Math.round(Math.random() * h);
    const r = Math.round(1 + Math.random() * 2);
    const op = (0.1 + Math.random() * 0.2).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ACCENT}" opacity="${op}"/>`;
  }).join('\n  ')}

  <!-- Connecting lines between some dots -->
  ${Array.from({ length: 6 }, () => {
    const x1 = Math.round(w * 0.6 + Math.random() * w * 0.35);
    const y1 = Math.round(Math.random() * h);
    const x2 = x1 + Math.round((Math.random() - 0.5) * 150);
    const y2 = y1 + Math.round((Math.random() - 0.5) * 100);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ACCENT}" stroke-width="0.5" opacity="0.08"/>`;
  }).join('\n  ')}
</svg>`);
}

// Generate banners for each platform
const banners = [
  { name: 'banner-x-twitter.png', w: 1500, h: 500 },
  { name: 'banner-linkedin.png', w: 1584, h: 396 },
  { name: 'banner-youtube.png', w: 2048, h: 1152, subtitle: 'AI Security Research & Pentesting' },
  { name: 'banner-bluesky.png', w: 3000, h: 1000 },
  { name: 'banner-mastodon.png', w: 1500, h: 500 },
  { name: 'banner-discord.png', w: 960, h: 540 },
];

for (const { name, w, h, subtitle } of banners) {
  await sharp(createBanner(w, h, { subtitle })).png().toFile(resolve(out, name));
  console.log(`✓ ${name} (${w}×${h})`);
}

console.log(`\n✓ All assets saved to: ${out}`);
console.log('\n📋 Platform guide:');
console.log('  X/Twitter:  avatar-400.png + banner-x-twitter.png');
console.log('  GitHub:     avatar-512.png');
console.log('  LinkedIn:   avatar-400.png + banner-linkedin.png');
console.log('  YouTube:    avatar-800.png + banner-youtube.png');
console.log('  Bluesky:    avatar-1000.png + banner-bluesky.png');
console.log('  Mastodon:   avatar-400.png + banner-mastodon.png');
console.log('  Discord:    avatar-512.png + banner-discord.png');

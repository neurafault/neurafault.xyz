import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'social-assets');
mkdirSync(out, { recursive: true });

const A = '#4ade80';
const BG = '#050505';
const TEXT = '#ececec';
const MUTED = '#555555';
const DIM = '#222222';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── Decorative elements ──────────────────────────────────
function particles(w, h, count = 15, seed = 1) {
  const rng = (i) => {
    let s = seed * 9301 + i * 49297;
    return ((s * s) % 233280) / 233280;
  };
  const dots = Array.from({ length: count }, (_, i) => {
    const cx = Math.round(rng(i * 3) * w);
    const cy = Math.round(rng(i * 3 + 1) * h);
    const r = (1 + rng(i * 3 + 2) * 2).toFixed(1);
    const op = (0.08 + rng(i * 7) * 0.15).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A}" opacity="${op}"/>`;
  });
  const lines = Array.from({ length: Math.floor(count / 2) }, (_, i) => {
    const x1 = Math.round(rng(i * 5 + 100) * w);
    const y1 = Math.round(rng(i * 5 + 101) * h);
    const x2 = x1 + Math.round((rng(i * 5 + 102) - 0.5) * 120);
    const y2 = y1 + Math.round((rng(i * 5 + 103) - 0.5) * 80);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${A}" stroke-width="0.5" opacity="0.06"/>`;
  });
  return [...dots, ...lines].join('\n  ');
}

function grid(w, h) {
  return `<defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.5" opacity="0.03"/>
    </pattern>
    <radialGradient id="gridmask" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <mask id="gmask"><rect width="${w}" height="${h}" fill="url(#gridmask)"/></mask>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#grid)" mask="url(#gmask)"/>`;
}

function glowOrb(cx, cy, r, opacity = 0.06) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${A}" opacity="${opacity}" filter="url(#blur)"/>`;
}

function blurDef() {
  return `<filter id="blur"><feGaussianBlur stdDeviation="60"/></filter>`;
}

// ── Avatar ────────────────────────────────────────────────
const avatarSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <defs>
    <clipPath id="top"><rect x="0" y="0" width="1000" height="488"/></clipPath>
    <clipPath id="bottom"><rect x="0" y="512" width="1000" height="488"/></clipPath>
    <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1000" height="1000" rx="120" fill="${BG}"/>
  <g clip-path="url(#top)" filter="url(#glow)">
    <text x="488" y="700" text-anchor="middle" font-family="'Courier New',monospace" font-size="660" font-weight="bold" fill="${A}">N</text>
  </g>
  <g clip-path="url(#bottom)" filter="url(#glow)">
    <text x="512" y="700" text-anchor="middle" font-family="'Courier New',monospace" font-size="660" font-weight="bold" fill="${A}">N</text>
  </g>
  <line x1="140" y1="500" x2="860" y2="500" stroke="${A}" stroke-width="2" opacity="0.2"/>
  <rect x="660" y="492" width="90" height="4" rx="2" fill="${A}" opacity="0.3"/>
  <rect x="250" y="508" width="60" height="3" rx="1" fill="${A}" opacity="0.2"/>
</svg>`);

for (const { name, size } of [
  { name: 'avatar-1000.png', size: 1000 },
  { name: 'avatar-800.png', size: 800 },
  { name: 'avatar-512.png', size: 512 },
  { name: 'avatar-400.png', size: 400 },
  { name: 'avatar-200.png', size: 200 },
]) {
  await sharp(avatarSvg).resize(size, size).png().toFile(resolve(out, name));
  console.log(`✓ ${name}`);
}

// ══════════════════════════════════════════════════════════
// PLATFORM-SPECIFIC BANNERS
// ══════════════════════════════════════════════════════════

// ── X / Twitter (1500×500) ───────────────────────────────
// Avatar overlaps bottom-left ~110px up, ~110px from left
// Safe zone for text: right side or center-right
const xBanner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <rect width="1500" height="500" fill="${BG}"/>
  ${blurDef()}
  ${grid(1500, 500)}
  ${glowOrb(900, 200, 200, 0.05)}
  ${glowOrb(1200, 350, 150, 0.04)}
  ${particles(1500, 500, 20, 1)}
  <!-- Text: right-aligned to avoid avatar overlap -->
  <text x="1440" y="200" text-anchor="end" font-family="'Courier New',monospace" font-size="72" font-weight="bold" fill="${TEXT}">neurafault</text>
  <text x="1440" y="260" text-anchor="end" font-family="'Courier New',monospace" font-size="24" fill="${A}">AI Security Research</text>
  <text x="1440" y="310" text-anchor="end" font-family="'Courier New',monospace" font-size="16" fill="${MUTED}">Breaking AI before it breaks you.</text>
  <!-- Accent line -->
  <rect x="880" y="330" width="560" height="1" fill="${A}" opacity="0.15"/>
  <!-- Bottom accent -->
  <rect x="0" y="498" width="1500" height="2" fill="${A}" opacity="0.2"/>
</svg>`);
await sharp(xBanner).png().toFile(resolve(out, 'banner-x-twitter.png'));
console.log('✓ banner-x-twitter.png (1500×500) — text right, avatar-safe left');

// ── LinkedIn (1584×396) ──────────────────────────────────
// Very wide, very short. Avatar bottom-left. Company info overlaps bottom.
// Safe zone: upper-center area
const liBanner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
  <rect width="1584" height="396" fill="${BG}"/>
  ${blurDef()}
  ${grid(1584, 396)}
  ${glowOrb(800, 150, 180, 0.05)}
  ${particles(1584, 396, 18, 2)}
  <!-- Text: center, upper third (safe from avatar & info bar) -->
  <text x="792" y="145" text-anchor="middle" font-family="'Courier New',monospace" font-size="60" font-weight="bold" fill="${TEXT}">neurafault</text>
  <text x="792" y="200" text-anchor="middle" font-family="'Courier New',monospace" font-size="20" fill="${A}">AI Security Research · LLM Vulnerabilities · Pentesting</text>
  <!-- Subtle divider -->
  <rect x="592" y="225" width="400" height="1" fill="${A}" opacity="0.12"/>
  <!-- Top accent -->
  <rect x="0" y="0" width="1584" height="2" fill="${A}" opacity="0.15"/>
</svg>`);
await sharp(liBanner).png().toFile(resolve(out, 'banner-linkedin.png'));
console.log('✓ banner-linkedin.png (1584×396) — text center-top, avatar-safe bottom-left');

// ── YouTube (2560×1440) ──────────────────────────────────
// Safe area: center 1546×423. Everything outside may be cropped.
// On mobile only ~1546×423 center is visible. On TV full image.
const ytW = 2560, ytH = 1440;
const safeL = (ytW - 1546) / 2;  // ~507
const safeT = (ytH - 423) / 2;   // ~508
const ytBanner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ytW}" height="${ytH}" viewBox="0 0 ${ytW} ${ytH}">
  <rect width="${ytW}" height="${ytH}" fill="${BG}"/>
  ${blurDef()}
  ${grid(ytW, ytH)}
  ${glowOrb(1280, 600, 400, 0.04)}
  ${glowOrb(800, 900, 250, 0.03)}
  ${particles(ytW, ytH, 30, 3)}
  <!-- All important text within safe zone (center) -->
  <text x="${ytW / 2}" y="${ytH / 2 - 30}" text-anchor="middle" font-family="'Courier New',monospace" font-size="90" font-weight="bold" fill="${TEXT}">neurafault</text>
  <text x="${ytW / 2}" y="${ytH / 2 + 40}" text-anchor="middle" font-family="'Courier New',monospace" font-size="30" fill="${A}">AI Security Research &amp; Pentesting</text>
  <text x="${ytW / 2}" y="${ytH / 2 + 85}" text-anchor="middle" font-family="'Courier New',monospace" font-size="20" fill="${MUTED}">neurafault.xyz</text>
  <!-- Safe zone indicator (invisible, for reference) -->
  <!-- <rect x="${safeL}" y="${safeT}" width="1546" height="423" fill="none" stroke="red" opacity="0.3"/> -->
  <!-- Top/bottom accent -->
  <rect x="0" y="0" width="${ytW}" height="2" fill="${A}" opacity="0.15"/>
  <rect x="0" y="${ytH - 2}" width="${ytW}" height="2" fill="${A}" opacity="0.15"/>
</svg>`);
await sharp(ytBanner).png().toFile(resolve(out, 'banner-youtube.png'));
console.log('✓ banner-youtube.png (2560×1440) — text in safe zone center');

// ── Bluesky (3000×1000) ──────────────────────────────────
// Avatar bottom-left. Very wide format.
// Text right-center, avoid bottom-left quadrant
const bsBanner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="1000" viewBox="0 0 3000 1000">
  <rect width="3000" height="1000" fill="${BG}"/>
  ${blurDef()}
  ${grid(3000, 1000)}
  ${glowOrb(1800, 400, 300, 0.05)}
  ${glowOrb(2400, 700, 200, 0.03)}
  ${particles(3000, 1000, 25, 4)}
  <!-- Text: center-right to avoid avatar -->
  <text x="1800" y="400" text-anchor="middle" font-family="'Courier New',monospace" font-size="100" font-weight="bold" fill="${TEXT}">neurafault</text>
  <text x="1800" y="480" text-anchor="middle" font-family="'Courier New',monospace" font-size="32" fill="${A}">AI Security Research</text>
  <text x="1800" y="540" text-anchor="middle" font-family="'Courier New',monospace" font-size="22" fill="${MUTED}">Breaking AI before it breaks you.</text>
  <rect x="1500" y="570" width="600" height="1" fill="${A}" opacity="0.12"/>
  <rect x="0" y="998" width="3000" height="2" fill="${A}" opacity="0.2"/>
</svg>`);
await sharp(bsBanner).png().toFile(resolve(out, 'banner-bluesky.png'));
console.log('✓ banner-bluesky.png (3000×1000) — text center-right, avatar-safe left');

// ── Discord server banner (960×540) ──────────────────────
// Shown behind server name. Top portion often obscured by server info overlay.
// Text center, slightly above middle
const dcBanner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="${BG}"/>
  ${blurDef()}
  ${grid(960, 540)}
  ${glowOrb(480, 200, 200, 0.06)}
  ${particles(960, 540, 15, 5)}
  <!-- Text: center, upper half (server name overlays bottom) -->
  <text x="480" y="210" text-anchor="middle" font-family="'Courier New',monospace" font-size="56" font-weight="bold" fill="${TEXT}">neurafault</text>
  <text x="480" y="260" text-anchor="middle" font-family="'Courier New',monospace" font-size="18" fill="${A}">AI Security Research</text>
  <rect x="330" y="280" width="300" height="1" fill="${A}" opacity="0.12"/>
</svg>`);
await sharp(dcBanner).png().toFile(resolve(out, 'banner-discord.png'));
console.log('✓ banner-discord.png (960×540) — text upper-center, server-info-safe');

// ── Mastodon (1500×500) ──────────────────────────────────
// Similar to Twitter but avatar may be different position.
// Profile info overlaps bottom. Text center-top.
const maBanner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <rect width="1500" height="500" fill="${BG}"/>
  ${blurDef()}
  ${grid(1500, 500)}
  ${glowOrb(750, 180, 200, 0.05)}
  ${particles(1500, 500, 18, 6)}
  <!-- Text: center, upper area (profile info at bottom) -->
  <text x="750" y="190" text-anchor="middle" font-family="'Courier New',monospace" font-size="68" font-weight="bold" fill="${TEXT}">neurafault</text>
  <text x="750" y="250" text-anchor="middle" font-family="'Courier New',monospace" font-size="22" fill="${A}">AI Security Research</text>
  <text x="750" y="295" text-anchor="middle" font-family="'Courier New',monospace" font-size="15" fill="${MUTED}">neurafault.xyz</text>
  <rect x="550" y="315" width="400" height="1" fill="${A}" opacity="0.12"/>
  <rect x="0" y="0" width="1500" height="2" fill="${A}" opacity="0.15"/>
</svg>`);
await sharp(maBanner).png().toFile(resolve(out, 'banner-mastodon.png'));
console.log('✓ banner-mastodon.png (1500×500) — text center-top, profile-safe bottom');

console.log(`\n✓ All assets in: ${out}`);
console.log(`
📋 What to upload where:
  X/Twitter:  avatar-400  + banner-x-twitter   (text right, avatar left)
  LinkedIn:   avatar-400  + banner-linkedin     (text center-top)
  YouTube:    avatar-800  + banner-youtube      (text in 1546×423 safe zone)
  Bluesky:    avatar-1000 + banner-bluesky      (text center-right)
  Mastodon:   avatar-400  + banner-mastodon     (text center-top)
  Discord:    avatar-512  + banner-discord      (text upper half)
  GitHub:     avatar-512                        (no banner)
`);

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg');
const outDir = 'public/icons';
mkdirSync(outDir, { recursive: true });

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(`${outDir}/${name}`);
  console.log(`  ${name} (${size}x${size})`);
}

// Also generate ICO-compatible 32x32 as favicon.ico alternative
await sharp(svg, { density: 300 })
  .resize(32, 32)
  .png()
  .toFile('public/favicon-32.png');

console.log('Done.');

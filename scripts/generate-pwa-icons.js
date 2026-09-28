import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating PWA icons from SVG...');

  // 1. 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Created public/pwa-192x192.png');

  // 2. 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Created public/pwa-512x512.png');

  // 3. 512x512 maskable icon (15% safe zone padding with #0c0a09 background)
  const innerSize = Math.round(512 * 0.75); // 384x384
  const innerBuffer = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: '#0c0a09'
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile('public/pwa-512x512-maskable.png');
  console.log('Created public/pwa-512x512-maskable.png');

  // 4. Apple Touch Icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created public/apple-touch-icon.png');

  // 5. Favicon (64x64)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.png');
  console.log('Created public/favicon.png');

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

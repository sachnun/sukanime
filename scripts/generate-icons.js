const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG with the Sukanime logo
const createSvg = (size, maskable = false) => {
  const padding = maskable ? size * 0.1 : 0;
  const innerSize = size - (padding * 2);
  const cornerRadius = maskable ? 0 : size * 0.1875;
  const fontSize = innerSize * 0.625;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${maskable ? `<rect width="${size}" height="${size}" fill="#E50914"/>` : ''}
    <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${cornerRadius}" fill="#E50914"/>
    <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white">S</text>
  </svg>`;
};

async function generateIcons() {
  console.log('Generating app icons...');
  
  for (const size of sizes) {
    // Regular icon
    const svg = Buffer.from(createSvg(size, false));
    await sharp(svg)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`Created icon-${size}x${size}.png`);
    
    // Maskable icon (for Android adaptive icons)
    if (size >= 192) {
      const maskableSvg = Buffer.from(createSvg(size, true));
      await sharp(maskableSvg)
        .png()
        .toFile(path.join(iconsDir, `icon-maskable-${size}x${size}.png`));
      console.log(`Created icon-maskable-${size}x${size}.png`);
    }
  }
  
  // Create favicon
  const faviconSvg = Buffer.from(createSvg(32, false));
  await sharp(faviconSvg)
    .png()
    .toFile(path.join(iconsDir, '../favicon.png'));
  console.log('Created favicon.png');
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);

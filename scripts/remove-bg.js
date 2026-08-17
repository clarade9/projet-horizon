// Supprime le fond blanc de logo.png et génère logo-transparent.png
// Puis régénère tous les favicons/icônes PWA depuis cette version propre.

const sharp = require('sharp');
const fs      = require('fs');
const path    = require('path');

const SRC         = path.join(__dirname, '../assets/icons/logo.png');
const TRANSPARENT = path.join(__dirname, '../assets/icons/logo-transparent.png');
const ICONS_DIR   = path.join(__dirname, '../assets/icons');
const ROOT_DIR    = path.join(__dirname, '..');

async function removeWhiteBackground() {
  console.log('→ Application du masque circulaire…');
  const meta = await sharp(SRC).metadata();
  const W = meta.width, H = meta.height;

  // Masque SVG circulaire — découpe propre sans toucher aux couleurs du logo.
  // Rayon = 46% de la dimension (laisse un léger bord intérieur au cercle dessiné).
  const r  = Math.round(Math.min(W, H) * 0.46);
  const cx = Math.round(W / 2), cy = Math.round(H / 2);
  const svg = Buffer.from(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>` +
    `<circle cx='${cx}' cy='${cy}' r='${r}' fill='white'/>` +
    `</svg>`
  );
  const mask = await sharp(svg).png().toBuffer();

  await sharp(SRC).joinChannel(mask).toFile(TRANSPARENT);
  console.log('✓ logo-transparent.png créé');
}

async function generateIcons() {
  console.log('\n→ Génération des icônes…');
  const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

  for (const size of sizes) {
    await sharp(TRANSPARENT)
      .resize(size, size, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .png()
      .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
    console.log(`✓ icon-${size}x${size}.png`);
  }

  // apple-touch-icon = 180x180
  fs.copyFileSync(path.join(ICONS_DIR, 'icon-180x180.png'), path.join(ICONS_DIR, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // favicon-16x16 / favicon-32x32
  fs.copyFileSync(path.join(ICONS_DIR, 'icon-16x16.png'), path.join(ICONS_DIR, 'favicon-16x16.png'));
  fs.copyFileSync(path.join(ICONS_DIR, 'icon-32x32.png'), path.join(ICONS_DIR, 'favicon-32x32.png'));
  console.log('✓ favicon-16x16.png');
  console.log('✓ favicon-32x32.png');

  // favicon.ico multi-taille
  const toIco = require('to-ico');
  const buf16 = fs.readFileSync(path.join(ICONS_DIR, 'icon-16x16.png'));
  const buf32 = fs.readFileSync(path.join(ICONS_DIR, 'icon-32x32.png'));
  const ico   = await toIco([buf16, buf32]);
  fs.writeFileSync(path.join(ROOT_DIR, 'favicon.ico'), ico);
  console.log('✓ favicon.ico');

  console.log('\nTous les fichiers générés avec succès.');
}

(async () => {
  await removeWhiteBackground();
  await generateIcons();
})().catch(err => { console.error(err); process.exit(1); });

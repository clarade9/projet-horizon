const sharp  = require('sharp');
const path   = require('path');
const src    = path.join(__dirname, '../assets/icons/logo.png');
const outDir = path.join(__dirname, '../assets/icons');

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

async function run() {
  for (const size of sizes) {
    await sharp(src)
      .resize(size, size, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .png()
      .toFile(path.join(outDir, `icon-${size}x${size}.png`));
    console.log(`✓ icon-${size}x${size}.png`);
  }

  // apple-touch-icon = 180x180
  await sharp(src)
    .resize(180, 180, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png');

  // favicon-16x16 et favicon-32x32 (alias des sizes déjà générées)
  const fs = require('fs');
  fs.copyFileSync(path.join(outDir, 'icon-16x16.png'), path.join(outDir, 'favicon-16x16.png'));
  fs.copyFileSync(path.join(outDir, 'icon-32x32.png'), path.join(outDir, 'favicon-32x32.png'));
  console.log('✓ favicon-16x16.png');
  console.log('✓ favicon-32x32.png');

  // favicon.ico : multi-taille (16+32) encodé manuellement via sharp → raw → ICO
  // On génère un .ico simple (32x32) en utilisant une lib si dispo, sinon on copie le PNG
  try {
    const toIco = require('to-ico');
    const buf16 = await sharp(src).resize(16,16,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
    const buf32 = await sharp(src).resize(32,32,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
    const ico   = await toIco([buf16, buf32]);
    fs.writeFileSync(path.join(__dirname, '../favicon.ico'), ico);
    console.log('✓ favicon.ico (multi-size ICO via to-ico)');
  } catch(e) {
    // Fallback : copier le PNG 32x32 en .ico (les navigateurs modernes acceptent PNG dans .ico)
    fs.copyFileSync(path.join(outDir, 'icon-32x32.png'), path.join(__dirname, '../favicon.ico'));
    console.log('✓ favicon.ico (PNG 32x32 fallback)');
  }

  console.log('\nTous les fichiers générés avec succès.');
}

run().catch(err => { console.error(err); process.exit(1); });

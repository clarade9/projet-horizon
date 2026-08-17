// ═══════════════════════════════════════
// optimize-images.js
// Compresse les PNG > 300 KB avec sharp
// Les originaux sont gardés en .backup
// Usage : node scripts/optimize-images.js
// ═══════════════════════════════════════
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const DOSSIERS = [
  'assets/characters',
  'assets/scenes',
  'assets/icons',
];

const SEUIL_KB  = 300;   // Compresse si > 300 KB
const MAX_W     = 800;   // Largeur max personnages
const MAX_W_SCN = 1920;  // Largeur max scènes

async function optimiser(fichier) {
  const stats     = fs.statSync(fichier);
  const tailleKB  = stats.size / 1024;
  const isScene   = fichier.includes('assets/scenes');
  const isIcon    = fichier.includes('assets/icons');
  const maxW      = isScene ? MAX_W_SCN : MAX_W;

  if (tailleKB <= SEUIL_KB) {
    console.log(`  ⏭  ${path.basename(fichier)} (${Math.round(tailleKB)} KB — OK)`);
    return;
  }

  const backup = fichier + '.backup';
  const tmp    = fichier + '.tmp.png';

  try {
    // Garde l'original en .backup (si pas déjà fait)
    if (!fs.existsSync(backup)) {
      fs.copyFileSync(fichier, backup);
    }

    // PNG : redimensionne + compresse
    // Pour le logo : conserve la transparence (PNG natif)
    await sharp(fichier)
      .resize(maxW, null, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 80 })
      .toFile(tmp);

    // Remplace l'original par la version compressée
    fs.renameSync(tmp, fichier);

    const newKB = fs.statSync(fichier).size / 1024;
    const gain  = Math.round((1 - newKB / tailleKB) * 100);
    console.log(`  ✅ ${path.basename(fichier).padEnd(28)} ${Math.round(tailleKB)} KB → ${Math.round(newKB)} KB  (-${gain}%)`);

  } catch (err) {
    // Nettoyage si erreur
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.error(`  ❌ ${path.basename(fichier)} : ${err.message}`);
  }
}

async function main() {
  console.log('\n🗜  Optimisation des images — Projet Horizon\n');
  let total = 0;
  let compresses = 0;

  for (const dossier of DOSSIERS) {
    if (!fs.existsSync(dossier)) continue;
    const fichiers = fs.readdirSync(dossier)
      .filter(f => f.endsWith('.png') && !f.endsWith('.backup'))
      .map(f => path.join(dossier, f));

    if (fichiers.length === 0) continue;
    console.log(`📁 ${dossier}/`);

    for (const f of fichiers) {
      const avantKB = fs.statSync(f).size / 1024;
      await optimiser(f);
      const apresKB = fs.statSync(f).size / 1024;
      total++;
      if (apresKB < avantKB - 1) compresses++;
    }
    console.log('');
  }

  console.log(`🎉 Terminé — ${compresses}/${total} fichiers compressés`);
  console.log('   Les originaux sont en .backup (supprimables après vérification)\n');
}

main().catch(console.error);

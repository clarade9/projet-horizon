// ═══════════════════════════════════════════════════════════════
// TEST 07 — Mémoire narrative
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

async function load(page) {
  await passSplash(page);
}

test.describe('Mémoire narrative (memoire.js)', () => {

  test('Aucune occurrence de "{prenom}" non substituée dans les lignes mémoire', async ({ page }) => {
    await load(page);

    const rawTexts = await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return [];
      // Simuler une mémoire avec des choix
      etatJeu.memoire = {
        0: { type: 'good', lettre: 'C' },
        1: { type: 'bad',  lettre: 'A' },
        2: { type: 'warn', lettre: 'B' },
      };
      const lines = [];
      for (let i = 0; i <= 9; i++) {
        const l = Memoire.lignesMemoire(i);
        l.forEach(line => { if (line.txt) lines.push(line.txt); });
      }
      return lines;
    });

    rawTexts.forEach(txt => {
      expect(txt).not.toContain('{prenom}');
    });
  });

  test('lignesMemoire(6) contient un callback sur Affaire 1', async ({ page }) => {
    await load(page);

    const lines = await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return [];
      etatJeu.memoire = { 0: { type: 'good', lettre: 'C' } };
      return Memoire.lignesMemoire(6).map(l => l.txt);
    });

    // Doit mentionner Aubert ou Affaire 1
    const hasCallback = lines.some(txt => /aubert|recrutement|affaire 1/i.test(txt));
    expect(hasCallback).toBe(true);
  });

  test('lignesMemoire(5) ne contient pas "M. Perrin" (doit être "Mme Perrin")', async ({ page }) => {
    await load(page);

    const lines = await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return [];
      etatJeu.memoire = { 1: { type: 'bad', lettre: 'A' } };
      return Memoire.lignesMemoire(5).map(l => l.txt);
    });

    lines.forEach(txt => {
      expect(txt).not.toMatch(/\bM\.\s+Perrin\b/);
    });
  });

  test('Le profil "prudent" n\'affiche plus "Vous naviguez"', async ({ page }) => {
    await load(page);

    const txt = await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return '';
      // Forcer profil prudent : 1 bad, 1 good
      etatJeu.memoire = {
        0: { type: 'bad',  lettre: 'A' },
        1: { type: 'good', lettre: 'C' },
      };
      const profil = Memoire.profilGlobal();
      if (profil !== 'prudent') return 'not-prudent:' + profil;
      const lines = Memoire.lignesMemoire(3);
      return lines.map(l => l.txt).join(' ');
    });

    expect(txt).not.toMatch(/vous naviguez/i);
  });

  test('profilGlobal() retourne "irréprochable" sur 10 good', async ({ page }) => {
    await load(page);

    const profil = await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return null;
      etatJeu.memoire = {};
      for (let i = 0; i < 10; i++) etatJeu.memoire[i] = { type: 'good', lettre: 'C' };
      return Memoire.profilGlobal();
    });

    expect(profil).toBe('irréprochable');
  });

  test('profilGlobal() retourne "fragile" sur ≥2 bad', async ({ page }) => {
    await load(page);

    const profil = await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return null;
      etatJeu.memoire = {
        0: { type: 'bad', lettre: 'A' },
        1: { type: 'bad', lettre: 'A' },
        2: { type: 'good', lettre: 'C' },
      };
      return Memoire.profilGlobal();
    });

    expect(profil).toBe('fragile');
  });

  test('enregistrerChoix() persiste dans etatJeu.memoire', async ({ page }) => {
    await load(page);

    await page.evaluate(() => {
      if (typeof Memoire === 'undefined') return;
      etatJeu.memoire = {};
      etatJeu.playerFirst = 'Test';
      Memoire.enregistrerChoix(0, 'good', 'C');
    });

    const mem = await page.evaluate(() => etatJeu.memoire);
    expect(mem[0]).toEqual({ type: 'good', lettre: 'C' });
  });

});

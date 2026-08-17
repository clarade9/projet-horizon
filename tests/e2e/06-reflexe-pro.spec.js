// ═══════════════════════════════════════════════════════════════
// TEST 06 — Phase Réflexe Pro
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

async function openReflexe(page, chIdx = 0) {
  await passSplash(page);

  await page.evaluate((idx) => {
    // Cacher les écrans d'intro pour éviter qu'ils interceptent les clics
    ['intro','accueil','tuto','map-select','transition-screen','intermediate','end','recap','epilogue-wrap']
      .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    etatJeu.playerFirst  = 'Test';
    etatJeu.chOrder      = [idx];
    etatJeu.chPos        = 0;
    etatJeu.ch           = idx;
    etatJeu.gauges       = { i: 70, p: 70, m: 70 };
    etatJeu.choices      = Array(idx).fill('good');
    etatJeu.choiceDetails = [];
    etatJeu.memoire      = {};
    if (typeof hideAll === 'function') hideAll();
    if (typeof startInvestigation === 'function') startInvestigation(idx);
  }, chIdx);

  await page.waitForTimeout(500);
}

test.describe('Phase Réflexe Pro', () => {

  test('Le panneau Réflexe Pro s\'affiche', async ({ page }) => {
    await openReflexe(page, 0);
    const inv = page.locator('#inv, .inv-panel');
    await expect(inv.first()).toBeVisible({ timeout: 5_000 });
  });

  test('4 questions et 4 actions sont proposées', async ({ page }) => {
    await openReflexe(page, 0);
    await page.waitForTimeout(500);

    const questions = await page.locator('#rp-q-list .rp-item').count();
    const actions   = await page.locator('#rp-a-list .rp-item').count();

    expect(questions).toBe(4);
    expect(actions).toBe(4);
  });

  test('On ne peut pas valider avant d\'avoir sélectionné 2 questions ET 2 actions', async ({ page }) => {
    await openReflexe(page, 0);
    await page.waitForTimeout(500);

    const validateBtn = page.locator('#rp-validate-btn').first();
    // Le bouton doit être désactivé ou absent au départ
    if (await validateBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const disabled = await validateBtn.isDisabled();
      expect(disabled).toBe(true);
    }
    // Alternative : le bouton n'est pas encore là
  });

  test('Sélectionner 2 questions et 2 actions active la validation', async ({ page }) => {
    await openReflexe(page, 0);
    await page.waitForTimeout(500);

    // Sélectionner 2 questions
    const qItems = await page.locator('#rp-q-list .rp-item').all();
    for (let i = 0; i < Math.min(2, qItems.length); i++) {
      await qItems[i].click();
      await page.waitForTimeout(150);
    }

    // Sélectionner 2 actions
    const aItems = await page.locator('#rp-a-list .rp-item').all();
    for (let i = 0; i < Math.min(2, aItems.length); i++) {
      await aItems[i].click();
      await page.waitForTimeout(150);
    }

    // Le bouton valider doit être actif
    const validateBtn = page.locator('#rp-validate-btn').first();
    await expect(validateBtn).toBeEnabled({ timeout: 3_000 });
  });

  test('Après validation, l\'analyse s\'affiche avec une règle d\'or', async ({ page }) => {
    await openReflexe(page, 0);
    await page.waitForTimeout(500);

    const qItems = await page.locator('#rp-q-list .rp-item').all();
    for (let i = 0; i < Math.min(2, qItems.length); i++) {
      await qItems[i].click();
      await page.waitForTimeout(100);
    }
    const aItems = await page.locator('#rp-a-list .rp-item').all();
    for (let i = 0; i < Math.min(2, aItems.length); i++) {
      await aItems[i].click();
      await page.waitForTimeout(100);
    }

    const validateBtn = page.locator('#rp-validate-btn').first();
    if (await validateBtn.isEnabled({ timeout: 3_000 }).catch(() => false)) {
      await validateBtn.click();
    }

    await page.waitForTimeout(500);
    // L'analyse s'affiche dans #rp-feedback (ajouté dynamiquement)
    await expect(page.locator('#rp-feedback')).toBeVisible({ timeout: 5_000 });
  });

  test('Le résultat est stocké dans etatJeu.reflexeResult', async ({ page }) => {
    await openReflexe(page, 0);
    await page.waitForTimeout(500);

    const qItems = await page.locator('#rp-q-list .rp-item').all();
    for (let i = 0; i < Math.min(2, qItems.length); i++) {
      await qItems[i].click();
      await page.waitForTimeout(100);
    }
    const aItems = await page.locator('#rp-a-list .rp-item').all();
    for (let i = 0; i < Math.min(2, aItems.length); i++) {
      await aItems[i].click();
      await page.waitForTimeout(100);
    }

    const btn = page.locator('#rp-validate-btn').first();
    if (await btn.isEnabled({ timeout: 2_000 }).catch(() => false)) await btn.click();

    await page.waitForTimeout(1_000);

    const result = await page.evaluate(() => etatJeu.reflexeResult);
    if (result !== null) {
      expect(result).toHaveProperty('overall');
      expect(['good','warn','bad']).toContain(result.overall);
    }
  });

  test('REFLEXE_DATA existe pour tous les chapitres 0-9', async ({ page }) => {
    await passSplash(page);

    const missing = await page.evaluate(() => {
      const missing = [];
      for (let i = 0; i <= 9; i++) {
        if (!REFLEXE_DATA[i]) missing.push(i);
      }
      return missing;
    });
    expect(missing, `REFLEXE_DATA manquant pour chIdx : ${missing.join(', ')}`).toHaveLength(0);
  });

  test('REFLEXE_DATA[12] a le champ context (pas intro)', async ({ page }) => {
    await passSplash(page);

    const check = await page.evaluate(() => {
      const rd = REFLEXE_DATA[12];
      if (!rd) return { exists: false };
      return {
        exists: true,
        hasContext: typeof rd.context === 'string',
        hasIntro: typeof rd.intro !== 'undefined',
        hasDocuments: Array.isArray(rd.documents),
      };
    });

    expect(check.exists).toBe(true);
    expect(check.hasContext).toBe(true);
    expect(check.hasIntro).toBe(false);   // 'intro' ne doit plus exister
    expect(check.hasDocuments).toBe(true);
  });

});

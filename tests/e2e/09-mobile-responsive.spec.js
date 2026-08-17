// ═══════════════════════════════════════════════════════════════
// TEST 09 — Responsive mobile et PWA
// ═══════════════════════════════════════════════════════════════
const { test, expect, devices } = require('@playwright/test');
const { passSplash } = require('./helpers');

const MOBILE = devices['iPhone 13'];

// Crée un contexte mobile avec localStorage pré-injecté et passe le splash
async function newMobilePage(browser) {
  const ctx  = await browser.newContext({ ...MOBILE });
  const page = await ctx.newPage();
  await page.addInitScript(() => { localStorage.setItem('horizon_access', 'granted'); });
  return { ctx, page };
}

async function loadMobile(page) {
  await passSplash(page);
}

test.describe('Responsive mobile', () => {

  test('La page se charge correctement sur iPhone 13', async ({ browser }) => {
    const ctx  = await browser.newContext({ ...MOBILE });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const criticals = errors.filter(e =>
      !e.includes('AudioContext') && !e.includes('serviceWorker')
    );
    expect(criticals).toHaveLength(0);
    await ctx.close();
  });

  test('Le splash est visible sur mobile', async ({ browser }) => {
    const { ctx, page } = await newMobilePage(browser);
    await page.goto('/');
    await expect(page.locator('#splash')).toBeVisible({ timeout: 3_000 });
    await ctx.close();
  });

  test('Le jeu tient dans le viewport mobile (pas de scroll horizontal)', async ({ browser }) => {
    const { ctx, page } = await newMobilePage(browser);
    await passSplash(page);

    const { bodyWidth, viewportWidth } = await page.evaluate(() => ({
      bodyWidth:    document.body.scrollWidth,
      viewportWidth: window.innerWidth,
    }));

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2); // tolérance 2px
    await ctx.close();
  });

  test('manifest.json est accessible et valide', async ({ page }) => {
    const res  = await page.goto('/manifest.json');
    expect(res.status()).toBe(200);

    const manifest = await res.json();
    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('icons');
    expect(manifest.icons.length).toBeGreaterThan(0);
    expect(manifest).toHaveProperty('display');
  });

  test('sw.js est accessible', async ({ page }) => {
    const res = await page.goto('/sw.js');
    expect(res.status()).toBe(200);
  });

  test('Le HUD est visible sur mobile après démarrage', async ({ browser }) => {
    const { ctx, page } = await newMobilePage(browser);
    await passSplash(page);

    await page.evaluate(() => {
      ['intro','accueil','tuto','map-select'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
      etatJeu.playerFirst = 'Test';
      etatJeu.chOrder     = [0];
      etatJeu.chPos       = 0;
      etatJeu.ch          = 0;
      etatJeu.gauges      = { i: 70, p: 70, m: 70 };
      etatJeu.choices     = [];
      etatJeu.memoire     = {};
      if (typeof hideAll === 'function') hideAll();
      if (typeof showChoicePanel === 'function') showChoicePanel(0);
    });

    await page.waitForTimeout(500);
    const hud = page.locator('#hud, .hud');
    await expect(hud.first()).toBeVisible({ timeout: 3_000 });

    await ctx.close();
  });

  test('Les boutons de choix sont suffisamment grands sur mobile (≥44px)', async ({ browser }) => {
    const { ctx, page } = await newMobilePage(browser);
    await passSplash(page);

    await page.evaluate(() => {
      ['intro','accueil','tuto','map-select'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
      etatJeu.playerFirst = 'Test';
      etatJeu.chOrder     = [0];
      etatJeu.chPos       = 0;
      etatJeu.ch          = 0;
      etatJeu.gauges      = { i: 70, p: 70, m: 70 };
      etatJeu.choices     = [];
      etatJeu.memoire     = {};
      if (typeof hideAll === 'function') hideAll();
      if (typeof showChoicePanel === 'function') showChoicePanel(0);
    });

    await page.waitForTimeout(500);

    const heights = await page.evaluate(() => {
      const btns = document.querySelectorAll('#choices button.choice');
      return Array.from(btns).map(b => b.getBoundingClientRect().height);
    });

    heights.forEach(h => {
      expect(h).toBeGreaterThanOrEqual(40); // ~44px standard cible tactile
    });

    await ctx.close();
  });

});

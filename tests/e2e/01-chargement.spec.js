// ═══════════════════════════════════════════════════════════════
// TEST 01 — Chargement, splash, intro
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

test.describe('Chargement initial', () => {

  test('La page se charge sans erreur JS critique', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', e => jsErrors.push(e.message));

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Filtrer les erreurs non critiques (audio, service worker)
    const criticalErrors = jsErrors.filter(e =>
      !e.includes('AudioContext') &&
      !e.includes('serviceWorker') &&
      !e.includes('NotAllowedError')
    );
    expect(criticalErrors, `Erreurs JS : ${criticalErrors.join('\n')}`).toHaveLength(0);
  });

  test('Le splash screen s\'affiche puis disparaît', async ({ page }) => {
    await page.goto('/');

    // Splash présent au départ
    const splash = page.locator('#splash');
    await expect(splash).toBeVisible({ timeout: 3_000 });

    // Clic pour dismisser
    await splash.click();

    // Splash disparaît (attend le détachement car la classe "out" garde l'élément visible pendant le fade)
    await expect(splash).toBeHidden({ timeout: 14_000 });
  });

  test('La barre de progression du splash monte de 0 à 100%', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('#splash-bar');
    await expect(bar).toBeVisible({ timeout: 3_000 });

    // Après quelques secondes, la barre doit avoir progressé
    await page.waitForTimeout(2_500);
    const transform = await bar.evaluate(el => el.style.transform);
    // scaleX(1) = 100%, scaleX(0) = 0% — doit être > 0
    const scale = parseFloat(transform.replace('scaleX(', ''));
    expect(scale).toBeGreaterThan(0.5);
  });

  test('L\'écran d\'introduction s\'affiche après le splash', async ({ page }) => {
    await passSplash(page);

    // L'intro ou le formulaire de personnalisation doit être visible
    const intro = page.locator('#intro, #personalization, .intro-screen').first();
    await expect(intro).toBeVisible({ timeout: 5_000 });
  });

  test('Toutes les ressources critiques se chargent (pas de 404)', async ({ page }) => {
    const failed = [];
    page.on('response', r => {
      if (r.status() === 404) failed.push(r.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

    // Filtrer les 404 sur des ressources non critiques (ex: favicon variations)
    const criticalFails = failed.filter(url =>
      (url.includes('/assets/scenes/') || url.includes('/assets/characters/') || url.includes('/js/'))
      && !url.includes('favicon')
    );
    expect(criticalFails, `404 sur : ${criticalFails.join('\n')}`).toHaveLength(0);
  });

  test('Le logo s\'affiche dans le splash', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('#splash-logo');
    await expect(logo).toBeVisible({ timeout: 3_000 });
  });

  test('CHAPTERS[] est chargé dans le contexte global', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const count = await page.evaluate(() => {
      return typeof CHAPTERS !== 'undefined' ? CHAPTERS.length : -1;
    });
    expect(count).toBe(13);
  });

  test('REFLEXE_DATA est chargé dans le contexte global', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const keys = await page.evaluate(() => {
      return typeof REFLEXE_DATA !== 'undefined' ? Object.keys(REFLEXE_DATA).length : -1;
    });
    expect(keys).toBeGreaterThan(10);
  });

});

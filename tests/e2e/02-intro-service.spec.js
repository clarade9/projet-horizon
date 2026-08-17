// ═══════════════════════════════════════════════════════════════
// TEST 02 — Personnalisation et sélection du service
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

test.describe('Personnalisation', () => {

  test('Formulaire d\'intro accepte le prénom et démarre', async ({ page }) => {
    await passSplash(page);

    // L'écran intro contient les champs prénom/nom
    const prenom = page.locator('#intro-prenom');
    const nom    = page.locator('#intro-nom');
    await prenom.waitFor({ state: 'visible', timeout: 8_000 });

    await prenom.fill('Alice');
    await nom.fill('Test');

    // Le bouton CTA doit être actif après remplissage
    const cta = page.locator('#intro-cta');
    await expect(cta).toBeEnabled({ timeout: 2_000 });
    await cta.click();

    // Après startGame(), l'accueil overlay s'affiche
    await expect(page.locator('#accueil-overlay')).toHaveClass(/on/, { timeout: 5_000 });
  });

  test('Le prénom est injecté dans etatJeu après startGame()', async ({ page }) => {
    await passSplash(page);

    const prenom = page.locator('#intro-prenom');
    await prenom.waitFor({ state: 'visible', timeout: 8_000 });

    await page.locator('#intro-prenom').fill('Caroline');
    await page.locator('#intro-nom').fill('Dupont');
    await page.locator('#intro-cta').click();

    await page.waitForTimeout(500);

    // Le prénom doit être stocké dans etatJeu
    const storedPrenom = await page.evaluate(() => etatJeu.playerFirst);
    expect(storedPrenom).toBe('Caroline');
  });

  test('Tous les services sont affichés sur la carte', async ({ page }) => {
    await passSplash(page);

    // Injecter l'état et afficher directement la carte de sélection
    await page.evaluate(() => {
      etatJeu.playerFirst = 'Test';
      etatJeu.playerLast  = 'Joueur';
      if (typeof hideAll === 'function') hideAll();
      if (typeof showMapSelect === 'function') showMapSelect();
    });

    await page.waitForTimeout(500);

    // La carte doit avoir plusieurs zones cliquables
    const zones = page.locator('.map-zone');
    const count = await zones.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

});

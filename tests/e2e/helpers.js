// ── Helpers partagés entre tous les tests E2E ────────────────

/**
 * Passe le splash de manière fiable :
 * - attend que #splash soit présent
 * - clique dessus pour déclencher le fade
 * - attend que la classe "out" apparaisse OU que splash soit détaché
 * - timeout généreux car le preloader anime la barre avant de laisser cliquer
 */
async function passSplash(page) {
  // Injecter le localStorage avant le chargement pour bypasser le password gate
  // et accélérer les transitions JS pour les tests
  await page.addInitScript(() => {
    localStorage.setItem('horizon_access', 'granted');
    // Override setTimeout pour les transitions du jeu (appliqué après chargement)
    window._testMode = true;
  });
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const splash = page.locator('#splash');

  // Attendre que le splash existe
  await splash.waitFor({ state: 'visible', timeout: 6_000 }).catch(() => {});

  // Cliquer jusqu'à ce que le splash disparaisse (max 12s)
  const deadline = Date.now() + 12_000;
  while (Date.now() < deadline) {
    const exists = await splash.count() > 0;
    if (!exists) break;
    const visible = await splash.isVisible().catch(() => false);
    if (!visible) break;
    await splash.click({ force: true }).catch(() => {});
    await page.waitForTimeout(400);
  }

  // Attendre détachement définitif
  await splash.waitFor({ state: 'detached', timeout: 6_000 }).catch(() => {});
  await page.waitForTimeout(200);
}

module.exports = { passSplash };

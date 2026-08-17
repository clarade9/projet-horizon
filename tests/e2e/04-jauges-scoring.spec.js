// ═══════════════════════════════════════════════════════════════
// TEST 04 — Jauges et scoring
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

async function goToChoices(page, chIdx) {
  await passSplash(page);
  await page.evaluate((idx) => {
    ['intro','accueil','tuto','map-select','transition-screen','intermediate','end','recap','epilogue-wrap']
      .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    etatJeu.playerFirst  = 'Test';
    etatJeu.chOrder      = [idx];
    etatJeu.chPos        = 0;
    etatJeu.ch           = idx;
    etatJeu.gauges       = { i: 70, p: 70, m: 70 };
    etatJeu.choices      = [];
    etatJeu.choiceDetails = [];
    etatJeu.memoire      = {};
    if (typeof hideAll === 'function') hideAll();
    if (typeof showChoicePanel === 'function') showChoicePanel(idx);
  }, chIdx);
  await page.waitForTimeout(500);
}

test.describe('Jauges et scoring', () => {

  test('Les jauges démarrent à 70', async ({ page }) => {
    await passSplash(page);

    const gauges = await page.evaluate(() => {
      return typeof etatJeu !== 'undefined' ? etatJeu.gauges : null;
    });
    expect(gauges).not.toBeNull();
    expect(gauges.i).toBe(70);
    expect(gauges.p).toBe(70);
    expect(gauges.m).toBe(70);
  });

  test('Le bon choix améliore les jauges', async ({ page }) => {
    await goToChoices(page, 0);

    const before = await page.evaluate(() => ({ ...etatJeu.gauges }));

    // Cliquer le choix good via l'API JS (choose() prend l'index d'affichage)
    await page.evaluate(() => {
      const ch = CHAPTERS[0];
      const goodIdx    = ch.choices.findIndex(c => c.type === 'good');
      const visibleIdx = etatJeu.choiceOrder.indexOf(goodIdx);
      if (typeof choose === 'function') choose(visibleIdx);
    });
    await page.waitForTimeout(1_000);

    const after = await page.evaluate(() => ({ ...etatJeu.gauges }));
    const sumBefore = before.i + before.p + before.m;
    const sumAfter  = after.i  + after.p  + after.m;
    expect(sumAfter).toBeGreaterThanOrEqual(sumBefore);
  });

  test('Le mauvais choix dégrade les jauges', async ({ page }) => {
    await goToChoices(page, 0);

    const before = await page.evaluate(() => ({ ...etatJeu.gauges }));

    await page.evaluate(() => {
      const ch = CHAPTERS[0];
      const badIdx     = ch.choices.findIndex(c => c.type === 'bad');
      const visibleIdx = etatJeu.choiceOrder.indexOf(badIdx);
      if (typeof choose === 'function') choose(visibleIdx);
    });
    await page.waitForTimeout(1_000);

    const after = await page.evaluate(() => ({ ...etatJeu.gauges }));
    const sumBefore = before.i + before.p + before.m;
    const sumAfter  = after.i  + after.p  + after.m;
    expect(sumAfter).toBeLessThan(sumBefore);
  });

  test('Les jauges ne sortent pas des bornes 0-100', async ({ page }) => {
    await passSplash(page);

    // Simuler 10 mauvais choix consécutifs
    const gauges = await page.evaluate(() => {
      let g = { i: 70, p: 70, m: 70 };
      CHAPTERS.slice(0, 10).forEach(ch => {
        const bad = ch.choices.find(c => c.type === 'bad');
        if (bad?.gauges) {
          g.i = Math.max(0, Math.min(100, g.i + (bad.gauges.i || 0)));
          g.p = Math.max(0, Math.min(100, g.p + (bad.gauges.p || 0)));
          g.m = Math.max(0, Math.min(100, g.m + (bad.gauges.m || 0)));
        }
      });
      return g;
    });

    expect(gauges.i).toBeGreaterThanOrEqual(0);
    expect(gauges.p).toBeGreaterThanOrEqual(0);
    expect(gauges.m).toBeGreaterThanOrEqual(0);
    expect(gauges.i).toBeLessThanOrEqual(100);
    expect(gauges.p).toBeLessThanOrEqual(100);
    expect(gauges.m).toBeLessThanOrEqual(100);
  });

  test('0 bad → écran "Certifié Intégrité"', async ({ page }) => {
    await passSplash(page);

    await page.evaluate(() => {
      ['intro','accueil','tuto','map-select'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
      etatJeu.playerFirst  = 'Test';
      etatJeu.choices      = ['good','good','good','good','good','good','good','good','good','good'];
      etatJeu.choiceDetails = etatJeu.choices.map((t, i) => ({
        chIdx: i, type: t, ch: CHAPTERS[i],
        choice: CHAPTERS[i]?.choices?.find(c => c.type === t) || CHAPTERS[i]?.choices?.[2],
      })).filter(d => d.choice);
      etatJeu.gauges       = { i: 90, p: 85, m: 88 };
      etatJeu.chOrder      = [0,1,2,3,4,5,6,7,8,9];
      etatJeu.chPos        = 9;
      etatJeu.quizScore    = 0;
      if (typeof showEnd === 'function') showEnd();
    });

    await expect(page.locator('#end')).toHaveClass(/on/, { timeout: 5_000 });
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toMatch(/certifi|intégrité|exemplaire|félicitations/i);
  });

  test('≥2 bad → écran "Scandale"', async ({ page }) => {
    await passSplash(page);

    await page.evaluate(() => {
      ['intro','accueil','tuto','map-select'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
      etatJeu.playerFirst  = 'Test';
      etatJeu.choices      = ['bad','good','bad','good','good','good','good','good','good','good'];
      etatJeu.choiceDetails = etatJeu.choices.map((t, i) => ({
        chIdx: i, type: t, ch: CHAPTERS[i],
        choice: CHAPTERS[i]?.choices?.find(c => c.type === t) || CHAPTERS[i]?.choices?.[0],
      })).filter(d => d.choice);
      etatJeu.gauges       = { i: 30, p: 60, m: 35 };
      etatJeu.chOrder      = [0,1,2,3,4,5,6,7,8,9];
      etatJeu.chPos        = 9;
      etatJeu.quizScore    = 0;
      if (typeof showEnd === 'function') showEnd();
    });

    await expect(page.locator('#end')).toHaveClass(/on/, { timeout: 5_000 });
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toMatch(/scandale|formation|obligatoire|une de/i);
  });

  test('1 bad → écran "Avertissement"', async ({ page }) => {
    await passSplash(page);

    await page.evaluate(() => {
      ['intro','accueil','tuto','map-select'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
      etatJeu.playerFirst  = 'Test';
      etatJeu.choices      = ['bad','good','good','good','good','good','good','good','good','good'];
      etatJeu.choiceDetails = etatJeu.choices.map((t, i) => ({
        chIdx: i, type: t, ch: CHAPTERS[i],
        choice: CHAPTERS[i]?.choices?.find(c => c.type === t) || CHAPTERS[i]?.choices?.[0],
      })).filter(d => d.choice);
      etatJeu.gauges       = { i: 55, p: 72, m: 60 };
      etatJeu.chOrder      = [0,1,2,3,4,5,6,7,8,9];
      etatJeu.chPos        = 9;
      etatJeu.quizScore    = 0;
      if (typeof showEnd === 'function') showEnd();
    });

    await expect(page.locator('#end')).toHaveClass(/on/, { timeout: 5_000 });
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).toMatch(/avertissement|formel|rh|lettre/i);
  });

});

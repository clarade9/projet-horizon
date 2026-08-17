// ═══════════════════════════════════════════════════════════════
// TEST 08 — Cohérence des données chapitres dans le navigateur
// Vérifie les règles narratives et de données directement
// sur les objets JS chargés dans le contexte de la page.
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

async function load(page) {
  await passSplash(page);
}

test.describe('Cohérence des données CHAPTERS[]', () => {

  test('13 chapitres chargés', async ({ page }) => {
    await load(page);
    const n = await page.evaluate(() => CHAPTERS.length);
    expect(n).toBe(13);
  });

  test('Chaque chapitre a un num, name, sub, sc, context, choices', async ({ page }) => {
    await load(page);
    const issues = await page.evaluate(() => {
      const issues = [];
      CHAPTERS.forEach((ch, i) => {
        ['num','name','sub','sc','context','choices'].forEach(f => {
          if (!ch[f]) issues.push(`CHAPTERS[${i}] (${ch.num||'?'}) — "${f}" manquant`);
        });
      });
      return issues;
    });
    expect(issues).toHaveLength(0);
  });

  test('Chaque chapitre a exactement 3 choix', async ({ page }) => {
    await load(page);
    const issues = await page.evaluate(() => {
      return CHAPTERS.map((ch, i) => ({ i, n: ch.num, c: ch.choices?.length }))
        .filter(r => r.c !== 3)
        .map(r => `CHAPTERS[${r.i}] ${r.n} — ${r.c} choix`);
    });
    expect(issues).toHaveLength(0);
  });

  test('Chaque chapitre a un choix good ET un choix bad', async ({ page }) => {
    await load(page);
    const issues = await page.evaluate(() => {
      const issues = [];
      CHAPTERS.forEach((ch, i) => {
        const types = (ch.choices || []).map(c => c.type);
        if (!types.includes('good')) issues.push(`CHAPTERS[${i}] (${ch.num}) — pas de choix 'good'`);
        if (!types.includes('bad'))  issues.push(`CHAPTERS[${i}] (${ch.num}) — pas de choix 'bad'`);
      });
      return issues;
    });
    expect(issues).toHaveLength(0);
  });

  test('Toutes les scènes référencées existent dans SCENES{}', async ({ page }) => {
    await load(page);
    const issues = await page.evaluate(() => {
      const sceneKeys = Object.keys(SCENES);
      const issues = [];
      CHAPTERS.forEach((ch, i) => {
        const check = (sc, src) => {
          if (sc && !sceneKeys.includes(sc))
            issues.push(`CHAPTERS[${i}] ${src} — scène "${sc}" absente de SCENES{}`);
        };
        check(ch.sc, 'sc principal');
        (ch.dialogue || []).forEach((l, li) => check(l.sc, `dialogue[${li}]`));
        (ch.preDialogue || []).forEach((l, li) => check(l.sc, `preDialogue[${li}]`));
        (ch.microDecisions || []).forEach((md, mi) => {
          (md.choices || []).forEach((c, ci) => {
            check(c.sceneAtLine0, `MD[${mi}] choice[${ci}].sceneAtLine0`);
            check(c.sceneAfter,   `MD[${mi}] choice[${ci}].sceneAfter`);
            (c.dialogueInject || []).forEach((l, li) => check(l.sc, `MD[${mi}] inject[${li}]`));
          });
        });
      });
      return issues;
    });
    expect(issues).toHaveLength(0);
  });

  test('Tous les hotspots sont dans les bornes 0-100', async ({ page }) => {
    await load(page);
    const issues = await page.evaluate(() => {
      const issues = [];
      CHAPTERS.forEach((ch, i) => {
        (ch.hotspots || []).forEach((h, hi) => {
          if (h.x < 0 || h.x + h.w > 100 || h.y < 0 || h.y + h.h > 100) {
            issues.push(`CHAPTERS[${i}] hotspot[${hi}] hors bornes (x:${h.x} y:${h.y} w:${h.w} h:${h.h})`);
          }
        });
      });
      return issues;
    });
    expect(issues).toHaveLength(0);
  });

  test('Affaire 4 — le dialogue ne contient pas le doublon "12 tonnes de déchets verts"', async ({ page }) => {
    await load(page);
    const hasDuplon = await page.evaluate(() => {
      const ch = CHAPTERS[3]; // Affaire 4
      return (ch.dialogue || []).some(l => l.txt && l.txt.includes('12 tonnes de déchets verts'));
    });
    expect(hasDuplon).toBe(false);
  });

  test('Affaire 2 MD1 option B utilise sceneAtLine0 = "bistro"', async ({ page }) => {
    await load(page);
    const scene = await page.evaluate(() => {
      const ch = CHAPTERS[1]; // Affaire 2
      const md0 = ch.microDecisions?.[0];
      const optB = md0?.choices?.find(c => c.letter === 'B');
      return optB?.sceneAtLine0 || null;
    });
    expect(scene).toBe('bistro');
  });

  test('Affaire 7 — le dialogue commence par une ligne de mise en scène Mme Ruiz', async ({ page }) => {
    await load(page);
    const firstLine = await page.evaluate(() => {
      const ch = CHAPTERS[6]; // Affaire 7
      return ch.dialogue?.[0]?.txt || '';
    });
    // La première ligne ne doit plus commencer par "reste évasive"
    expect(firstLine).not.toMatch(/reste évasive/i);
    // Elle doit introduire Mme Ruiz ou l'offre
    expect(firstLine).toMatch(/ruiz|s.installe|terrain|offre/i);
  });

  test('Affaire 8 — plus de mention "la direction connaît la situation"', async ({ page }) => {
    await load(page);
    const hasMention = await page.evaluate(() => {
      const ch = CHAPTERS[7]; // Affaire 8
      return (ch.dialogue || []).some(l =>
        l.txt && l.txt.includes('direction connaît la situation')
      );
    });
    expect(hasMention).toBe(false);
  });

  test('reflexe-data ch=2 utilise "Mme Favre" (pas "M. Favre")', async ({ page }) => {
    await load(page);
    const issues = await page.evaluate(() => {
      const rd = REFLEXE_DATA[2];
      if (!rd) return ['REFLEXE_DATA[2] manquant'];
      const issues = [];
      const str = JSON.stringify(rd);
      if (/\bM\.\s+Favre\b/.test(str)) issues.push('Contient encore "M. Favre"');
      if (!/\bMme\s+Favre\b/.test(str)) issues.push('Ne contient pas "Mme Favre"');
      return issues;
    });
    expect(issues).toHaveLength(0);
  });

  test('PRESSIONS_DATA n\'a pas de clé dupliquée', async ({ page }) => {
    await load(page);
    // Lire le source pour détecter les doublons de clés
    const src = await page.evaluate(async () => {
      const r = await fetch('/js/data/pressions-data.js');
      return r.text();
    });
    const keys = [...src.matchAll(/^\s{2}(\d+):/gm)].map(m => Number(m[1]));
    const seen = {};
    const dups = [];
    keys.forEach(k => {
      seen[k] = (seen[k] || 0) + 1;
      if (seen[k] === 2) dups.push(k);
    });
    expect(dups, `Clés dupliquées dans PRESSIONS_DATA : ${dups.join(', ')}`).toHaveLength(0);
  });

  test('Les jauges all-good restent au-dessus de 75 pour i', async ({ page }) => {
    await load(page);
    const finalI = await page.evaluate(() => {
      let g = { i: 70, p: 70, m: 70 };
      CHAPTERS.slice(0, 10).forEach(ch => {
        const c = ch.choices.find(x => x.type === 'good');
        if (c?.gauges) {
          g.i = Math.max(0, Math.min(100, g.i + (c.gauges.i || 0)));
        }
      });
      return g.i;
    });
    expect(finalI).toBeGreaterThanOrEqual(75);
  });

});

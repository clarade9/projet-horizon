// ═══════════════════════════════════════════════════════════════
// TEST 05 — Scènes et assets visuels
// ═══════════════════════════════════════════════════════════════
const { test, expect } = require('@playwright/test');
const { passSplash } = require('./helpers');

// Toutes les scènes à tester avec leur chapitre de référence
const SCENE_TESTS = [
  { scene: 'prologue',          ch: null },
  { scene: 'rh',                ch: 0    },
  { scene: 'bureaularoche',     ch: 1    },
  { scene: 'resto',             ch: 1    },
  { scene: 'bistro',            ch: 1    },
  { scene: 'finance',           ch: 2    },
  { scene: 'pesee',             ch: 3    },
  { scene: 'indus',             ch: 4    },
  { scene: 'mairie',            ch: 5    },
  { scene: 'bureau2',           ch: 6    },
  { scene: 'bureau9',           ch: 9    },
  { scene: 'nuitcollecte',      ch: 11   },
  { scene: 'reunionqse',        ch: 12   },
  { scene: 'zone3',             ch: 12   },
  { scene: 'maintenance',       ch: 10   },
  { scene: 'maintenancebureau', ch: 10   },
];

test.describe('Scènes et images', () => {

  test('Aucune image de scène ne retourne 404', async ({ page }) => {
    const failed404 = [];
    page.on('response', r => {
      if (r.status() === 404 && r.url().includes('/assets/scenes/')) {
        failed404.push(r.url().split('/assets/scenes/')[1]);
      }
    });

    await passSplash(page);
    // Déclencher toutes les scènes via buildScene()
    await page.evaluate(() => {
      const sceneKeys = Object.keys(SCENES);
      sceneKeys.forEach(key => {
        try {
          const el = buildScene(key);
          // Forcer le chargement des images
          el.querySelectorAll('img').forEach(img => {
            document.body.appendChild(img.cloneNode());
          });
        } catch(e) {}
      });
    });

    await page.waitForTimeout(3_000);
    expect(failed404, `Images 404 : ${failed404.join(', ')}`).toHaveLength(0);
  });

  test('Aucun portrait de personnage ne retourne 404', async ({ page }) => {
    const failed404 = [];
    page.on('response', r => {
      if (r.status() === 404 && r.url().includes('/assets/characters/')) {
        failed404.push(r.url().split('/assets/characters/')[1]);
      }
    });

    await passSplash(page);
    // Charger tous les portraits déclarés dans le preloader
    await page.evaluate(() => {
      const chars = ['deschamps','dominique','laroche','lefebvre','patrice',
        'aubert','ruiz','perrin','formatrice','favre','fontaine','renaud',
        'marie','vasseur','kevin','andrieux'];
      chars.forEach(name => {
        const img = new Image();
        img.src = `assets/characters/${name}.png`;
        document.body.appendChild(img);
      });
    });

    await page.waitForTimeout(3_000);
    expect(failed404, `Portraits 404 : ${failed404.join(', ')}`).toHaveLength(0);
  });

  test('buildScene() crée un élément DOM valide pour chaque scène', async ({ page }) => {
    await passSplash(page);

    const results = await page.evaluate(() => {
      const results = {};
      Object.keys(SCENES).forEach(key => {
        try {
          const el = SCENES[key]();
          results[key] = {
            ok: el instanceof Element,
            hasClass: el.className !== '',
          };
        } catch(e) {
          results[key] = { ok: false, error: e.message };
        }
      });
      return results;
    });

    const failed = Object.entries(results).filter(([, v]) => !v.ok);
    expect(failed.map(([k]) => k), `Scènes en erreur : ${failed.map(([k,v]) => `${k}: ${v.error||'no element'}`).join(', ')}`).toHaveLength(0);
  });

  test('La scène bistro est bien distincte de restojour', async ({ page }) => {
    await passSplash(page);

    const sources = await page.evaluate(() => {
      const getImgSrc = (scene) => {
        const el = SCENES[scene]();
        const img = el.querySelector('img.sc-bg, img');
        return img ? img.src : null;
      };
      return {
        bistro:    getImgSrc('bistro'),
        restojour: getImgSrc('restojour'),
      };
    });

    // Les deux scènes doivent référencer des fichiers différents
    expect(sources.bistro).not.toBe(sources.restojour);
    expect(sources.bistro).toContain('bistro');
    expect(sources.restojour).toMatch(/restojour/);
  });

  test('La scène nuitcollecte charge depot.png', async ({ page }) => {
    await passSplash(page);

    const src = await page.evaluate(() => {
      const el = SCENES['nuitcollecte']();
      const img = el.querySelector('img');
      return img ? img.src : null;
    });

    expect(src).toContain('depot.png');
  });

  test('Les téléphones overlay se chargent sans 404', async ({ page }) => {
    const failed = [];
    page.on('response', r => {
      if (r.status() === 404 && r.url().includes('telephone')) {
        failed.push(r.url());
      }
    });

    await passSplash(page);
    await page.evaluate(() => {
      ['telephonelaroche','telephoneperrin','telephonerenaud','telephonefontaine'].forEach(name => {
        const img = new Image();
        img.src = `assets/scenes/${name}.webp`;
        document.body.appendChild(img);
      });
    });
    await page.waitForTimeout(2_000);
    expect(failed).toHaveLength(0);
  });

});

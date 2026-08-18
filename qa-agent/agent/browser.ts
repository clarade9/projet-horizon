import { Page } from 'playwright';

export class BrowserManager {
  static async passSplash(page: Page): Promise<void> {
    await page.addInitScript(() => {
      localStorage.setItem('horizon_access', 'granted');
      (window as unknown as Record<string, unknown>)['_testMode'] = true;
    });
    await page.goto(page.url() || '/');
    await page.waitForLoadState('domcontentloaded');

    const splash = page.locator('#splash');
    await splash.waitFor({ state: 'visible', timeout: 6_000 }).catch(() => {});

    const deadline = Date.now() + 12_000;
    while (Date.now() < deadline) {
      const visible = await splash.isVisible().catch(() => false);
      if (!visible) break;
      await splash.click({ force: true }).catch(() => {});
      await page.waitForTimeout(400);
    }

    await splash.waitFor({ state: 'detached', timeout: 6_000 }).catch(() => {});
    await page.waitForTimeout(200);
  }

  static async jumpToChapter(page: Page, chIdx: number): Promise<void> {
    await page.evaluate((idx: number) => {
      const g = window as unknown as Record<string, unknown>;
      const etatJeu = g['etatJeu'] as Record<string, unknown>;
      if (!etatJeu) return;

      etatJeu['playerFirst'] = 'QA';
      etatJeu['playerLast'] = 'Agent';
      etatJeu['service'] = 'rh';
      etatJeu['chOrder'] = [idx];
      etatJeu['chPos'] = 0;
      etatJeu['ch'] = idx;
      etatJeu['dlgIdx'] = 0;
      etatJeu['gauges'] = { i: 70, p: 70, m: 70 };
      etatJeu['choices'] = [];
      etatJeu['choiceDetails'] = [];

      ['intro', 'accueil', 'tuto', 'map-select', 'transition-screen', 'intermediate', 'end', 'recap', 'epilogue-wrap']
        .forEach((id: string) => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });

      const CHAPTERS = g['CHAPTERS'] as Array<Record<string, unknown>>;
      if (typeof g['buildScene'] === 'function' && CHAPTERS?.[idx]?.['sc']) {
        (g['buildScene'] as (sc: unknown) => void)(CHAPTERS[idx]['sc']);
      }
      if (typeof g['showContext'] === 'function' && CHAPTERS?.[idx]) {
        (g['showContext'] as (ch: unknown) => void)(CHAPTERS[idx]);
      }
    }, chIdx);
    await page.waitForTimeout(300);
  }

  static async injectSupabaseMock(page: Page): Promise<void> {
    await page.addInitScript(() => {
      (window as unknown as Record<string, unknown>)['supabase'] = {
        createClient: () => ({
          channel: (_name: string) => ({
            on: () => ({
              subscribe: (cb?: (status: string) => void) => {
                if (cb) cb('SUBSCRIBED');
                return {};
              },
            }),
            send: async () => {},
            unsubscribe: async () => {},
          }),
          from: (_table: string) => ({
            select: () => ({
              eq: () => ({ single: async () => ({ data: null, error: null }) }),
              limit: () => ({ single: async () => ({ data: null, error: null }) }),
            }),
            insert: async () => ({ data: null, error: null }),
            update: () => ({ eq: async () => ({ data: null, error: null }) }),
            upsert: () => ({
              select: () => ({
                single: async () => ({ data: { id: 'mock-id' }, error: null }),
              }),
            }),
          }),
        }),
      };
    });
  }

  static async screenshot(page: Page): Promise<string> {
    const buf = await page.screenshot({ type: 'png', fullPage: false });
    return buf.toString('base64');
  }
}

import { Page } from 'playwright';
import * as crypto from 'crypto';
import { GameState } from './types';
import { Memory } from './memory';
import { BrowserManager } from './browser';

export class Observer {
  private _consoleErrors: string[] = [];
  private _failedRequests: string[] = [];
  private allConsoleErrors: string[] = [];
  private allFailedRequests: string[] = [];

  constructor(
    private page: Page,
    private memory: Memory,
    private runId: string,
  ) {
    page.on('pageerror', (err) => {
      this._consoleErrors.push(err.message);
      this.allConsoleErrors.push(err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this._consoleErrors.push(msg.text());
        this.allConsoleErrors.push(msg.text());
      }
    });
    page.on('response', (res) => {
      if (res.status() >= 400) {
        const entry = `${res.status()} ${res.url()}`;
        this._failedRequests.push(entry);
        this.allFailedRequests.push(entry);
      }
    });
  }

  async capture(): Promise<GameState> {
    const t0 = Date.now();

    const [screenshot, visibleText, clickableElements] = await Promise.all([
      BrowserManager.screenshot(this.page),
      this.page.evaluate(() =>
        (document.body?.innerText ?? '').trim().slice(0, 4000)
      ),
      this.page.evaluate(() => {
        const els = document.querySelectorAll(
          'button:not([disabled]), [role="button"], a[href], .choice, .micro-btn, .ctx-btn, .rp-item, #dlg'
        );
        return Array.from(els).map(el => {
          const h = el as HTMLElement;
          return `${el.tagName}#${h.id || '?'} "${(h.innerText ?? '').slice(0, 40).trim()}"`;
        }).filter(Boolean);
      }),
    ]);

    const loadTime = Date.now() - t0;
    const stateHash = crypto.createHash('sha256')
      .update(visibleText + this.page.url())
      .digest('hex')
      .slice(0, 16);

    const consoleErrors = [...this._consoleErrors];
    const failedRequests = [...this._failedRequests];
    this._consoleErrors = [];
    this._failedRequests = [];

    const state: GameState = {
      url: this.page.url(),
      screenshot,
      visibleText,
      clickableElements,
      consoleErrors,
      failedRequests,
      loadTime,
      timestamp: Date.now(),
      stateHash,
    };

    this.memory.saveState(this.runId, state);
    return state;
  }

  getAllErrors(): { consoleErrors: string[]; failedRequests: string[] } {
    return {
      consoleErrors: [...this.allConsoleErrors],
      failedRequests: [...this.allFailedRequests],
    };
  }
}

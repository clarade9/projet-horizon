import { Page } from 'playwright';
import { Brain } from '../agent/brain';
import { Memory } from '../agent/memory';
import { Observer } from '../agent/observer';
import { CheckerResult } from '../agent/types';

const PERFORMANCE_THRESHOLD_MS = 5000;

const IGNORED_ERRORS = [
  'AudioContext',
  'serviceWorker',
  'NotAllowedError',
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed',
];

export class TechnicalChecker {
  constructor(private _brain: Brain, private memory: Memory) {}

  async check(observer: Observer, page: Page, runId: string): Promise<CheckerResult> {
    const t0 = Date.now();
    const { consoleErrors, failedRequests } = observer.getAllErrors();

    const criticalErrors = consoleErrors.filter(e =>
      !IGNORED_ERRORS.some(ignored => e.includes(ignored))
    );

    for (const err of criticalErrors) {
      this.memory.saveAnomaly({
        runId,
        type: 'technical',
        severity: err.toLowerCase().includes('uncaught') ? 'critical' : 'major',
        screen: page.url(),
        message: `Erreur console : ${err.slice(0, 200)}`,
        timestamp: Date.now(),
      });
    }

    const criticalFailed = failedRequests.filter(url =>
      (url.includes('/assets/') || url.includes('/js/') || url.includes('/css/')) &&
      !url.includes('favicon')
    );

    for (const url of criticalFailed) {
      this.memory.saveAnomaly({
        runId,
        type: 'technical',
        severity: 'critical',
        screen: page.url(),
        message: `Requête échouée : ${url}`,
        timestamp: Date.now(),
      });
    }

    const perfMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (!nav) return { loadComplete: 0 };
      return { loadComplete: nav.loadEventEnd - nav.startTime };
    });

    if (perfMetrics.loadComplete > PERFORMANCE_THRESHOLD_MS) {
      this.memory.saveAnomaly({
        runId,
        type: 'technical',
        severity: 'minor',
        screen: page.url(),
        message: `Chargement lent : ${Math.round(perfMetrics.loadComplete)}ms (seuil : ${PERFORMANCE_THRESHOLD_MS}ms)`,
        timestamp: Date.now(),
      });
    }

    const missingGlobals = await page.evaluate(() => {
      const required = ['CHAPTERS', 'REFLEXE_DATA', 'etatJeu', 'LEXIQUE'];
      const g = window as unknown as Record<string, unknown>;
      return required.filter(name => typeof g[name] === 'undefined');
    });

    for (const name of missingGlobals) {
      this.memory.saveAnomaly({
        runId,
        type: 'technical',
        severity: 'critical',
        screen: page.url(),
        message: `Global critique non défini : ${name}`,
        timestamp: Date.now(),
      });
    }

    const anomalies = this.memory.getAnomaliesForRun(runId).filter(a => a.type === 'technical');
    return {
      checker: 'technical',
      passed: anomalies.filter(a => a.severity === 'critical' || a.severity === 'major').length === 0,
      anomalies,
      duration: Date.now() - t0,
    };
  }
}

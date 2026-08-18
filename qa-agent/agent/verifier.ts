import { Page, Browser } from 'playwright';
import { Brain } from './brain';
import { Memory } from './memory';
import { Observer } from './observer';
import { BrowserManager } from './browser';
import { PersonaEngine } from './personas';
import { RunConfig, Persona, CheckerResult } from './types';
import { GameplayChecker } from '../checkers/gameplay';
import { NarrativeChecker } from '../checkers/narrative';
import { TechnicalChecker } from '../checkers/technical';
import { SpellingChecker } from '../checkers/spelling';
import { ResponsiveChecker } from '../checkers/responsive';

const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
];

export class Verifier {
  private gameplay: GameplayChecker;
  private narrative: NarrativeChecker;
  private technical: TechnicalChecker;
  private spelling: SpellingChecker;
  private responsive: ResponsiveChecker;

  constructor(
    private brain: Brain,
    private memory: Memory,
    _config: RunConfig,
  ) {
    this.gameplay = new GameplayChecker(brain, memory);
    this.narrative = new NarrativeChecker(brain, memory);
    this.technical = new TechnicalChecker(brain, memory);
    this.spelling = new SpellingChecker(brain, memory);
    this.responsive = new ResponsiveChecker(brain, memory);
  }

  async runPersona(
    page: Page,
    observer: Observer,
    persona: Persona,
    config: RunConfig,
  ): Promise<CheckerResult[]> {
    const results: CheckerResult[] = [];
    const t0 = Date.now();

    await page.goto(config.baseUrl);
    await BrowserManager.passSplash(page);

    if (config.checkers.includes('technical')) {
      const technicalResult = await this.technical.check(observer, page, config.runId);
      results.push({ ...technicalResult, duration: Date.now() - t0 });
    }

    const textSamples: Array<{ screen: string; text: string }> = [];
    let prevText = (await observer.capture()).visibleText;

    for (const chIdx of config.chaptersToTest) {
      console.log(`  [${persona.name}] Chapitre ${chIdx}`);
      await BrowserManager.jumpToChapter(page, chIdx);
      await PersonaEngine.think(persona, page);

      const state = await observer.capture();
      textSamples.push({ screen: `chapter-${chIdx}`, text: state.visibleText });
      this.memory.saveText(config.runId, `chapter-${chIdx}`, state.visibleText);

      if (config.checkers.includes('gameplay')) {
        await this.gameplay.checkChapter(page, observer, state, chIdx, persona, config.runId);
      }

      if (config.checkers.includes('narrative')) {
        await this.narrative.checkChapter(state, prevText, chIdx, config.runId);
      }

      prevText = state.visibleText;
    }

    if (config.checkers.includes('spelling') && textSamples.length > 0) {
      const spellingResult = await this.spelling.checkBatch(textSamples, config.runId);
      results.push(spellingResult);
    }

    const anomalies = this.memory.getAnomaliesForRun(config.runId);
    for (const checkerName of config.checkers) {
      if (results.find(r => r.checker === checkerName)) continue;
      const checkerAnomalies = anomalies.filter(a => a.type === checkerName);
      results.push({
        checker: checkerName,
        passed: checkerAnomalies.filter(a => a.severity === 'critical' || a.severity === 'major').length === 0,
        anomalies: checkerAnomalies,
        duration: Date.now() - t0,
      });
    }

    return results;
  }

  async runResponsive(browser: Browser, config: RunConfig): Promise<CheckerResult[]> {
    const results: CheckerResult[] = [];

    for (const viewport of VIEWPORTS) {
      console.log(`  [responsive] ${viewport.width}×${viewport.height}`);
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();

      await page.addInitScript(() => {
        localStorage.setItem('horizon_access', 'granted');
      });

      await page.goto(config.baseUrl);
      await BrowserManager.passSplash(page);

      const localObserver = new Observer(page, this.memory, config.runId);
      const state = await localObserver.capture();
      const result = await this.responsive.checkViewport(state, viewport, config.runId);
      results.push(result);

      await context.close();
    }

    return results;
  }
}

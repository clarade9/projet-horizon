import { Page } from 'playwright';
import { Brain } from '../agent/brain';
import { Memory } from '../agent/memory';
import { Observer } from '../agent/observer';
import { GameState, Persona } from '../agent/types';
import { PersonaEngine } from '../agent/personas';

export class GameplayChecker {
  constructor(private brain: Brain, private memory: Memory) {}

  async checkChapter(
    page: Page,
    observer: Observer,
    initialState: GameState,
    chIdx: number,
    persona: Persona,
    runId: string,
  ): Promise<void> {
    const chapterName = `Affaire ${chIdx + 1}`;

    const gameplayIssues = await this.brain.analyzeGameplay(initialState, chapterName);
    for (const issue of gameplayIssues) {
      this.memory.saveAnomaly({
        runId,
        type: 'gameplay',
        severity: issue.severity,
        screen: page.url(),
        message: issue.message,
        screenshot: initialState.screenshot,
        timestamp: Date.now(),
      });
    }

    const ctxBtn = page.locator('.ctx-btn');
    if (await ctxBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const prevHash = initialState.stateHash;
      await ctxBtn.click();
      await page.waitForTimeout(persona.clickDelay);

      const dlgVisible = await page.locator('#dlg').isVisible({ timeout: 3_000 }).catch(() => false);
      const mdVisible = await page.locator('#md').isVisible({ timeout: 3_000 }).catch(() => false);

      if (!dlgVisible && !mdVisible) {
        const state = await observer.capture();
        this.memory.saveAnomaly({
          runId,
          type: 'gameplay',
          severity: 'critical',
          screen: page.url(),
          message: `Chapitre ${chIdx} : ni dialogue ni micro-décision visible après fermeture du contexte`,
          screenshot: state.screenshot,
          timestamp: Date.now(),
        });
        this.memory.saveTransition(runId, prevHash, state.stateHash, 'click .ctx-btn → stuck', persona.name);
        return;
      }

      const newState = await observer.capture();
      this.memory.saveTransition(runId, prevHash, newState.stateHash, 'click .ctx-btn', persona.name);
    }

    for (let i = 0; i < 25; i++) {
      const dlg = page.locator('#dlg');
      if (!await dlg.isVisible({ timeout: 500 }).catch(() => false)) break;

      const prevState = await observer.capture();
      await dlg.click({ force: true }).catch(() => {});
      await page.waitForTimeout(Math.max(50, persona.clickDelay / 2));

      const mdBtn = page.locator('.micro-btn').first();
      if (await mdBtn.isVisible({ timeout: 300 }).catch(() => false)) {
        const idx = PersonaEngine.pickChoiceIndex(persona, await page.locator('.micro-btn').count());
        const btn = page.locator('.micro-btn').nth(idx);
        await btn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(persona.clickDelay);
      }

      const nextState = await observer.capture();
      this.memory.saveTransition(runId, prevState.stateHash, nextState.stateHash, `click #dlg [line ${i}]`, persona.name);
    }

    const invVisible = await page.locator('#inv').isVisible({ timeout: 8_000 }).catch(() => false);
    if (invVisible) {
      const qItems = await page.locator('#rp-q-list .rp-item').all();
      const aItems = await page.locator('#rp-a-list .rp-item').all();

      for (let i = 0; i < Math.min(2, qItems.length); i++) {
        await qItems[i].click().catch(() => {});
        await page.waitForTimeout(100);
      }
      for (let i = 0; i < Math.min(2, aItems.length); i++) {
        await aItems[i].click().catch(() => {});
        await page.waitForTimeout(100);
      }

      const validateBtn = page.locator('#rp-validate-btn').first();
      if (await validateBtn.isEnabled({ timeout: 3_000 }).catch(() => false)) {
        const prevState = await observer.capture();
        await validateBtn.click();
        await page.waitForTimeout(500);
        const nextState = await observer.capture();
        this.memory.saveTransition(runId, prevState.stateHash, nextState.stateHash, 'click #rp-validate-btn', persona.name);
      }
    }

    const choicesVisible = await page.locator('#choices button.choice').first()
      .isVisible({ timeout: 8_000 }).catch(() => false);

    if (choicesVisible) {
      const choiceBtns = await page.locator('#choices button.choice').all();
      const idx = PersonaEngine.pickChoiceIndex(persona, choiceBtns.length);

      if (choiceBtns[idx]) {
        const prevState = await observer.capture();
        await choiceBtns[idx].click();
        await page.waitForTimeout(600);

        const verdictVisible = await page.locator('#verdict').isVisible({ timeout: 8_000 }).catch(() => false);
        const nextState = await observer.capture();
        this.memory.saveTransition(runId, prevState.stateHash, nextState.stateHash, `click choice[${idx}]`, persona.name);

        if (!verdictVisible) {
          this.memory.saveAnomaly({
            runId,
            type: 'gameplay',
            severity: 'major',
            screen: page.url(),
            message: `Chapitre ${chIdx} : aucun verdict affiché après le choix`,
            screenshot: nextState.screenshot,
            timestamp: Date.now(),
          });
        }
      }
    } else {
      this.memory.saveAnomaly({
        runId,
        type: 'gameplay',
        severity: 'critical',
        screen: page.url(),
        message: `Chapitre ${chIdx} : panel de choix jamais apparu`,
        screenshot: initialState.screenshot,
        timestamp: Date.now(),
      });
    }
  }
}

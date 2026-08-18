import { Brain } from '../agent/brain';
import { Memory } from '../agent/memory';
import { GameState } from '../agent/types';

export class NarrativeChecker {
  constructor(private brain: Brain, private memory: Memory) {}

  async checkChapter(
    state: GameState,
    prevText: string,
    chIdx: number,
    runId: string,
  ): Promise<void> {
    const chapterContext = `Affaire ${chIdx + 1}`;
    const issues = await this.brain.analyzeNarrative(state, prevText, chapterContext);

    for (const issue of issues) {
      this.memory.saveAnomaly({
        runId,
        type: 'narrative',
        severity: issue.severity,
        screen: state.url,
        message: issue.message,
        screenshot: state.screenshot,
        timestamp: Date.now(),
      });
    }
  }
}

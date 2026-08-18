import { Brain } from '../agent/brain';
import { Memory } from '../agent/memory';
import { CheckerResult } from '../agent/types';

const BATCH_SIZE = 5;

export class SpellingChecker {
  constructor(private brain: Brain, private memory: Memory) {}

  async checkBatch(
    texts: Array<{ screen: string; text: string }>,
    runId: string,
  ): Promise<CheckerResult> {
    const t0 = Date.now();

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const results = await this.brain.analyzeSpelling(batch);

      for (const result of results) {
        for (const issue of result.issues) {
          this.memory.saveAnomaly({
            runId,
            type: 'spelling',
            severity: 'minor',
            screen: result.screen,
            message: issue,
            timestamp: Date.now(),
          });
        }
        this.memory.updateTextIssues(runId, result.screen, result.issues, []);
      }
    }

    const anomalies = this.memory.getAnomaliesForRun(runId).filter(a => a.type === 'spelling');
    return {
      checker: 'spelling',
      passed: anomalies.filter(a => a.severity === 'critical' || a.severity === 'major').length === 0,
      anomalies,
      duration: Date.now() - t0,
    };
  }
}

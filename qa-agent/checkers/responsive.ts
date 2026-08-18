import { Brain } from '../agent/brain';
import { Memory } from '../agent/memory';
import { GameState, CheckerResult } from '../agent/types';

export class ResponsiveChecker {
  constructor(private brain: Brain, private memory: Memory) {}

  async checkViewport(
    state: GameState,
    viewport: { width: number; height: number },
    runId: string,
  ): Promise<CheckerResult> {
    const t0 = Date.now();

    const issues = await this.brain.analyzeResponsive(state, viewport);
    for (const issue of issues) {
      this.memory.saveAnomaly({
        runId,
        type: 'responsive',
        severity: issue.severity,
        screen: `${state.url}@${viewport.width}×${viewport.height}`,
        message: issue.message,
        screenshot: state.screenshot,
        timestamp: Date.now(),
      });
    }

    const anomalies = this.memory.getAnomaliesForRun(runId).filter(a => a.type === 'responsive');
    return {
      checker: 'responsive',
      passed: anomalies.filter(a => a.severity === 'critical').length === 0,
      anomalies,
      duration: Date.now() - t0,
    };
  }
}

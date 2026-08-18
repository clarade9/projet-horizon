export interface GameState {
  url: string;
  screenshot: string;
  visibleText: string;
  clickableElements: string[];
  consoleErrors: string[];
  failedRequests: string[];
  loadTime: number;
  timestamp: number;
  stateHash: string;
}

export type PersonaName = 'explorer' | 'normal' | 'chaotic' | 'impatient' | 'lost';

export interface Persona {
  name: PersonaName;
  description: string;
  clickDelay: number;
  skipAnimations: boolean;
  followHappyPath: boolean;
  tryWrongInputs: boolean;
  visitAllScreens: boolean;
  maxActionsPerScreen: number;
}

export type CheckerName = 'gameplay' | 'narrative' | 'technical' | 'spelling' | 'responsive';

export interface Anomaly {
  id?: number;
  runId: string;
  type: CheckerName;
  severity: 'critical' | 'major' | 'minor' | 'info';
  screen: string;
  message: string;
  screenshot?: string;
  timestamp: number;
}

export interface CheckerResult {
  checker: CheckerName;
  passed: boolean;
  anomalies: Anomaly[];
  duration: number;
}

export interface RunConfig {
  mode: 'fast' | 'full' | 'narrative-only' | 'spelling-only';
  personas: PersonaName[];
  checkers: CheckerName[];
  baseUrl: string;
  runId: string;
  reportDir: string;
  dbPath: string;
  chaptersToTest: number[];
}

export interface Fact {
  runId: string;
  key: string;
  value: string;
  screen: string;
  timestamp: number;
}

export interface TextSample {
  runId: string;
  screen: string;
  text: string;
  spelling_issues?: string;
  narrative_issues?: string;
  timestamp: number;
}

import Database from 'better-sqlite3';
import { GameState, Anomaly, TextSample } from './types';

export class Memory {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        url TEXT,
        screenshot TEXT,
        visible_text TEXT,
        clickable_elements TEXT,
        console_errors TEXT,
        failed_requests TEXT,
        load_time INTEGER,
        timestamp INTEGER,
        state_hash TEXT
      );

      CREATE TABLE IF NOT EXISTS transitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        from_hash TEXT,
        to_hash TEXT,
        action TEXT,
        persona TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS facts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        key TEXT,
        value TEXT,
        screen TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS anomalies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        type TEXT,
        severity TEXT,
        screen TEXT,
        message TEXT,
        screenshot TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS texts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        screen TEXT,
        text TEXT,
        spelling_issues TEXT,
        narrative_issues TEXT,
        timestamp INTEGER
      );

      CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        character_id TEXT,
        name TEXT,
        role TEXT,
        first_seen_screen TEXT,
        appears_in_chapters TEXT
      );
    `);
  }

  saveState(runId: string, state: GameState): void {
    this.db.prepare(`
      INSERT INTO states (run_id, url, screenshot, visible_text, clickable_elements,
        console_errors, failed_requests, load_time, timestamp, state_hash)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `).run(
      runId, state.url, state.screenshot, state.visibleText,
      JSON.stringify(state.clickableElements),
      JSON.stringify(state.consoleErrors),
      JSON.stringify(state.failedRequests),
      state.loadTime, state.timestamp, state.stateHash
    );
  }

  saveAnomaly(anomaly: Anomaly): number {
    const result = this.db.prepare(`
      INSERT INTO anomalies (run_id, type, severity, screen, message, screenshot, timestamp)
      VALUES (?,?,?,?,?,?,?)
    `).run(
      anomaly.runId, anomaly.type, anomaly.severity,
      anomaly.screen, anomaly.message, anomaly.screenshot ?? null,
      anomaly.timestamp
    );
    return result.lastInsertRowid as number;
  }

  saveTransition(runId: string, fromHash: string, toHash: string, action: string, persona: string): void {
    this.db.prepare(`
      INSERT INTO transitions (run_id, from_hash, to_hash, action, persona, timestamp)
      VALUES (?,?,?,?,?,?)
    `).run(runId, fromHash, toHash, action, persona, Date.now());
  }

  saveText(runId: string, screen: string, text: string): void {
    this.db.prepare(`
      INSERT INTO texts (run_id, screen, text, timestamp) VALUES (?,?,?,?)
    `).run(runId, screen, text, Date.now());
  }

  updateTextIssues(runId: string, screen: string, spellingIssues: string[], narrativeIssues: string[]): void {
    this.db.prepare(`
      UPDATE texts SET spelling_issues = ?, narrative_issues = ?
      WHERE run_id = ? AND screen = ?
    `).run(JSON.stringify(spellingIssues), JSON.stringify(narrativeIssues), runId, screen);
  }

  getAnomaliesForRun(runId: string): Anomaly[] {
    return this.db.prepare(
      'SELECT * FROM anomalies WHERE run_id = ? ORDER BY severity DESC, timestamp ASC'
    ).all(runId) as Anomaly[];
  }

  getTransitionsForRun(runId: string): Array<{ from_hash: string; to_hash: string; action: string; persona: string }> {
    return this.db.prepare(
      'SELECT * FROM transitions WHERE run_id = ? ORDER BY timestamp ASC'
    ).all(runId) as Array<{ from_hash: string; to_hash: string; action: string; persona: string }>;
  }

  getTextsForRun(runId: string): TextSample[] {
    return this.db.prepare('SELECT * FROM texts WHERE run_id = ?').all(runId) as TextSample[];
  }

  getStatesForRun(runId: string): GameState[] {
    return this.db.prepare('SELECT * FROM states WHERE run_id = ? ORDER BY timestamp ASC').all(runId) as GameState[];
  }
}

import * as fs from 'fs';
import * as path from 'path';
import { RunConfig, CheckerResult, Anomaly } from '../agent/types';
import { Memory } from '../agent/memory';

export class Reporter {
  constructor(private config: RunConfig, private memory: Memory) {}

  async generate(results: CheckerResult[]): Promise<void> {
    const reportDir = path.join(this.config.reportDir, this.config.runId);
    fs.mkdirSync(reportDir, { recursive: true });

    const anomalies = this.memory.getAnomaliesForRun(this.config.runId);
    const transitions = this.memory.getTransitionsForRun(this.config.runId);

    const asciiGraph = this.buildAsciiGraph(transitions);
    const markdown = this.buildMarkdown(results, anomalies, asciiGraph);
    const html = this.buildHtml(results, anomalies, asciiGraph);

    fs.writeFileSync(path.join(reportDir, 'report.md'), markdown, 'utf8');
    fs.writeFileSync(path.join(reportDir, 'report.html'), html, 'utf8');

    const screenshotDir = path.join(reportDir, 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });
    anomalies
      .filter(a => a.screenshot && a.severity === 'critical')
      .forEach((a, i) => {
        fs.writeFileSync(
          path.join(screenshotDir, `critical-${i}.png`),
          Buffer.from(a.screenshot!, 'base64')
        );
      });

    console.log(`[Reporter] Rapport généré : ${reportDir}/report.html`);
  }

  private buildAsciiGraph(
    transitions: Array<{ from_hash: string; to_hash: string; action: string; persona: string }>
  ): string {
    if (transitions.length === 0) return 'Aucune transition enregistrée.';

    // Build adjacency list
    const children = new Map<string, Array<{ to: string; action: string }>>();
    const allTo = new Set<string>();

    for (const t of transitions) {
      if (!children.has(t.from_hash)) children.set(t.from_hash, []);
      children.get(t.from_hash)!.push({ to: t.to_hash, action: t.action });
      allTo.add(t.to_hash);
    }

    // Roots = nodes that never appear as a destination
    const roots = [...children.keys()].filter(h => !allTo.has(h));
    const visited = new Set<string>();
    const lines: string[] = [];

    const dfs = (hash: string, indent: string): void => {
      if (visited.has(hash)) {
        lines.push(`${indent}[${hash.slice(0, 8)}] (déjà visité)`);
        return;
      }
      visited.add(hash);
      lines.push(`${indent}[${hash.slice(0, 8)}]`);
      for (const { to, action } of children.get(hash) ?? []) {
        lines.push(`${indent}  └─[${action.slice(0, 30)}]──►`);
        dfs(to, indent + '      ');
      }
    };

    for (const root of roots.length > 0 ? roots : [transitions[0].from_hash]) {
      dfs(root, '');
    }

    const uniqueStates = new Set([
      ...transitions.map(t => t.from_hash),
      ...transitions.map(t => t.to_hash),
    ]);

    return [
      'GRAPHE D\'EXPLORATION DES ÉTATS',
      '═'.repeat(60),
      ...lines,
      '═'.repeat(60),
      `États uniques : ${uniqueStates.size} | Transitions : ${transitions.length}`,
    ].join('\n');
  }

  private buildMarkdown(results: CheckerResult[], anomalies: Anomaly[], graph: string): string {
    const critical = anomalies.filter(a => a.severity === 'critical');
    const major = anomalies.filter(a => a.severity === 'major');
    const minor = anomalies.filter(a => a.severity === 'minor');

    const header = [
      `# Rapport QA — Run ${this.config.runId}`,
      `**Date :** ${new Date().toISOString()}`,
      `**Mode :** ${this.config.mode}`,
      `**Cible :** ${this.config.baseUrl}`,
      `**Personas :** ${this.config.personas.join(', ')}`,
      `**Checkers :** ${this.config.checkers.join(', ')}`,
      '',
      '## Résumé',
      `| Sévérité | Nombre |`,
      `|---|---|`,
      `| 🔴 Critique | ${critical.length} |`,
      `| 🟠 Majeur | ${major.length} |`,
      `| 🟡 Mineur | ${minor.length} |`,
      '',
    ];

    const checkerSections = results.map(r => {
      const icon = r.passed ? '✅' : '❌';
      const list = r.anomalies.length > 0
        ? r.anomalies.map(a => `- [${a.severity}] **${a.screen}** : ${a.message}`).join('\n')
        : '_Aucun problème détecté_';
      return [`## ${icon} ${r.checker} (${r.duration}ms)`, list, ''].join('\n');
    });

    const graphSection = ['## Graphe d\'exploration (ASCII)', '```', graph, '```'].join('\n');

    return [...header, ...checkerSections, graphSection].join('\n');
  }

  private buildHtml(results: CheckerResult[], anomalies: Anomaly[], graph: string): string {
    const critical = anomalies.filter(a => a.severity === 'critical');
    const major = anomalies.filter(a => a.severity === 'major');
    const minor = anomalies.filter(a => a.severity === 'minor');

    const escHtml = (s: string): string =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const checkerRows = results.map(r => {
      const icon = r.passed ? '✅' : '❌';
      const rows = r.anomalies.map(a => `
        <tr class="sev-${a.severity}">
          <td><span class="badge badge-${a.severity}">${a.severity}</span></td>
          <td class="screen-cell">${escHtml(a.screen)}</td>
          <td>${escHtml(a.message)}</td>
        </tr>`).join('');

      return `
      <details open>
        <summary>${icon} <strong>${r.checker}</strong> — ${r.anomalies.length} problème(s) — ${r.duration}ms</summary>
        ${r.anomalies.length > 0 ? `
        <table>
          <thead><tr><th>Sévérité</th><th>Écran</th><th>Message</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>` : '<p class="ok">Aucun problème détecté.</p>'}
      </details>`;
    }).join('\n');

    const criticalScreenshots = anomalies
      .filter(a => a.screenshot && a.severity === 'critical')
      .map((a, i) => `
        <div class="screenshot-card">
          <div class="screenshot-label">[${i + 1}] ${escHtml(a.message.slice(0, 100))}</div>
          <img src="data:image/png;base64,${a.screenshot}" alt="Screenshot anomalie critique ${i + 1}">
        </div>`).join('');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>QA Report — ${this.config.runId}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0f0f1a; color: #e0e0e0; padding: 2rem; }
  h1 { color: #a78bfa; margin-bottom: 1rem; }
  h2 { color: #7c3aed; margin: 1.5rem 0 0.5rem; }
  .meta { color: #9ca3af; font-size: 0.875rem; margin-bottom: 1.5rem; }
  .meta span { margin-right: 1.5rem; }
  .summary { display: flex; gap: 1rem; margin-bottom: 2rem; }
  .summary-card { background: #1e1e2e; border-radius: 8px; padding: 1rem 1.5rem; text-align: center; min-width: 120px; }
  .summary-card .count { font-size: 2rem; font-weight: bold; }
  .count-critical { color: #ef4444; }
  .count-major { color: #f97316; }
  .count-minor { color: #eab308; }
  .summary-card .label { font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem; }
  details { background: #1e1e2e; border-radius: 8px; margin-bottom: 1rem; overflow: hidden; }
  summary { padding: 0.875rem 1rem; cursor: pointer; user-select: none; font-size: 1rem; }
  summary:hover { background: #2a2a3e; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { background: #2a2a3e; padding: 0.5rem 0.75rem; text-align: left; color: #9ca3af; font-weight: 600; }
  td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #2a2a3e; vertical-align: top; }
  .screen-cell { font-family: monospace; font-size: 0.75rem; color: #7c3aed; max-width: 200px; word-break: break-all; }
  .sev-critical td { border-left: 3px solid #ef4444; }
  .sev-major td { border-left: 3px solid #f97316; }
  .sev-minor td { border-left: 3px solid #eab308; }
  .badge { padding: 0.125rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
  .badge-critical { background: #ef4444; color: white; }
  .badge-major { background: #f97316; color: white; }
  .badge-minor { background: #eab308; color: black; }
  .badge-info { background: #3b82f6; color: white; }
  .ok { color: #22c55e; padding: 0.75rem 1rem; }
  pre { background: #0a0a14; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; color: #a78bfa; white-space: pre-wrap; }
  .screenshots { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
  .screenshot-card { background: #1e1e2e; border-radius: 8px; overflow: hidden; max-width: 480px; }
  .screenshot-label { padding: 0.5rem 0.75rem; font-size: 0.75rem; color: #9ca3af; background: #2a2a3e; }
  .screenshot-card img { width: 100%; display: block; }
</style>
</head>
<body>
<h1>Rapport QA — Projet Horizon</h1>
<div class="meta">
  <span><strong>Run :</strong> ${this.config.runId}</span>
  <span><strong>Date :</strong> ${new Date().toISOString()}</span>
  <span><strong>Mode :</strong> ${this.config.mode}</span>
  <span><strong>Cible :</strong> ${this.config.baseUrl}</span>
  <span><strong>Personas :</strong> ${this.config.personas.join(', ')}</span>
</div>

<h2>Résumé</h2>
<div class="summary">
  <div class="summary-card">
    <div class="count count-critical">${critical.length}</div>
    <div class="label">🔴 Critique</div>
  </div>
  <div class="summary-card">
    <div class="count count-major">${major.length}</div>
    <div class="label">🟠 Majeur</div>
  </div>
  <div class="summary-card">
    <div class="count count-minor">${minor.length}</div>
    <div class="label">🟡 Mineur</div>
  </div>
</div>

<h2>Résultats par checker</h2>
${checkerRows}

${criticalScreenshots ? `<h2>Screenshots anomalies critiques</h2><div class="screenshots">${criticalScreenshots}</div>` : ''}

<h2>Graphe d'exploration des états</h2>
<pre>${escHtml(graph)}</pre>

</body>
</html>`;
  }
}

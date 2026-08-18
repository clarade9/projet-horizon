import { Command } from 'commander';
import { chromium } from 'playwright';
import * as crypto from 'crypto';
import { Memory } from './memory';
import { Observer } from './observer';
import { Brain } from './brain';
import { Verifier } from './verifier';
import { PersonaEngine } from './personas';
import { Reporter } from '../reporters/report';
import { RunConfig, PersonaName, CheckerName } from './types';

const program = new Command();
program
  .option('--fast', 'Mode rapide : persona normal, affaires 1–3 (~5min)')
  .option('--full', 'Mode complet : tous les personas, tous les écrans (~20min)')
  .option('--narrative-only', 'Checker narratif uniquement')
  .option('--spelling-only', 'Checker orthographe uniquement')
  .option('--url <url>', 'Surcharge l\'URL cible')
  .option('--db <path>', 'Chemin de la base SQLite')
  .option('--report-dir <path>', 'Dossier de sortie du rapport')
  .parse(process.argv);

const opts = program.opts();

function buildConfig(): RunConfig {
  const runId = crypto.randomBytes(8).toString('hex');
  const baseUrl = (opts['url'] as string | undefined)
    ?? process.env['QA_BASE_URL']
    ?? 'https://projet-horizon-sem.vercel.app';
  const reportDir = (opts['reportDir'] as string | undefined)
    ?? process.env['QA_REPORT_DIR']
    ?? './reports';
  const dbPath = (opts['db'] as string | undefined)
    ?? process.env['QA_DB_PATH']
    ?? './qa-agent.db';

  if (opts['narrativeOnly']) {
    return {
      mode: 'narrative-only',
      personas: ['explorer'],
      checkers: ['narrative'],
      baseUrl, runId, reportDir, dbPath,
      chaptersToTest: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
  }
  if (opts['spellingOnly']) {
    return {
      mode: 'spelling-only',
      personas: ['explorer'],
      checkers: ['spelling'],
      baseUrl, runId, reportDir, dbPath,
      chaptersToTest: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
  }
  if (opts['full']) {
    return {
      mode: 'full',
      personas: ['explorer', 'normal', 'chaotic', 'impatient', 'lost'] as PersonaName[],
      checkers: ['gameplay', 'narrative', 'technical', 'spelling', 'responsive'] as CheckerName[],
      baseUrl, runId, reportDir, dbPath,
      chaptersToTest: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
  }
  // Default: --fast
  return {
    mode: 'fast',
    personas: ['normal'] as PersonaName[],
    checkers: ['technical', 'gameplay'] as CheckerName[],
    baseUrl, runId, reportDir, dbPath,
    chaptersToTest: [0, 1, 2],
  };
}

async function main(): Promise<void> {
  const apiKey = process.env['ANTHROPIC_API_KEY'];
  if (!apiKey) {
    console.error('[QA Agent] ANTHROPIC_API_KEY manquante. Définir dans .env ou en variable d\'environnement.');
    process.exit(1);
  }

  const config = buildConfig();
  console.log(`[QA Agent] Run ${config.runId} — mode : ${config.mode}`);
  console.log(`[QA Agent] Cible : ${config.baseUrl}`);
  console.log(`[QA Agent] Personas : ${config.personas.join(', ')}`);
  console.log(`[QA Agent] Checkers : ${config.checkers.join(', ')}`);

  const memory = new Memory(config.dbPath);
  memory.initSchema();

  const brain = new Brain(apiKey);
  const verifier = new Verifier(brain, memory, config);

  const allResults = [];

  for (const personaName of config.personas) {
    console.log(`\n[QA Agent] Persona : ${personaName}`);
    const browser = await chromium.launch({ headless: true });

    try {
      const persona = PersonaEngine.create(personaName);
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (QA-Agent/1.0; Projet-Horizon)',
      });

      await context.addInitScript(() => {
        localStorage.setItem('horizon_access', 'granted');
        (window as unknown as Record<string, unknown>)['_testMode'] = true;
      });

      const page = await context.newPage();
      const observer = new Observer(page, memory, config.runId);

      const results = await verifier.runPersona(page, observer, persona, config);
      allResults.push(...results);

      if (config.checkers.includes('responsive') && personaName === config.personas[0]) {
        console.log('\n[QA Agent] Checker responsive...');
        const responsiveResults = await verifier.runResponsive(browser, config);
        allResults.push(...responsiveResults);
      }

      await context.close();
    } finally {
      await browser.close();
    }
  }

  const reporter = new Reporter(config, memory);
  await reporter.generate(allResults);

  const criticals = allResults.flatMap(r => r.anomalies).filter(a => a.severity === 'critical');

  console.log(`\n[QA Agent] Terminé.`);
  console.log(`[QA Agent] Rapport : ${config.reportDir}/${config.runId}/report.html`);

  if (criticals.length > 0) {
    console.error(`[QA Agent] ❌ ${criticals.length} anomalie(s) critique(s) détectée(s) — exit code 1`);
    process.exit(1);
  } else {
    console.log('[QA Agent] ✅ Aucune anomalie critique.');
  }
}

main().catch(e => {
  console.error('[QA Agent] Erreur fatale :', e);
  process.exit(1);
});

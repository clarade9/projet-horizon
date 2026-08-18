import Anthropic from '@anthropic-ai/sdk';
import { GameState, CheckerName } from './types';

interface Issue {
  severity: 'critical' | 'major' | 'minor' | 'info';
  message: string;
}

interface PartialAnomaly {
  type: CheckerName;
  severity: 'critical' | 'major' | 'minor' | 'info';
  message: string;
  screen: string;
}

function extractJson(text: string): unknown {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  } catch {
    return {};
  }
}

export class Brain {
  private client: Anthropic;
  private readonly model = 'claude-sonnet-4-6';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async analyzeGameplay(state: GameState, chapterName: string): Promise<PartialAnomaly[]> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: state.screenshot },
          },
          {
            type: 'text',
            text: `Tu analyses un serious game anticorruption français. L'affaire en cours est : "${chapterName}".

Éléments cliquables détectés :
${state.clickableElements.slice(0, 20).join('\n')}

Texte visible :
${state.visibleText.slice(0, 800)}

TÂCHE : Identifie les problèmes de gameplay visibles sur ce screenshot :
1. Boutons qui devraient être cliquables mais ne le sont pas
2. Interface bloquée (spinner infini, rien ne répond)
3. Éléments UI critiques manquants (panel de choix sans boutons, dialogue sans texte)
4. Jauges (Intégrité / Projet / Image SEM) hors bornes ou absentes alors qu'elles devraient être présentes
5. Écran complètement vide ou blanc

Réponds UNIQUEMENT en JSON : { "issues": [{ "severity": "critical|major|minor", "message": "description en français" }] }
Si aucun problème : { "issues": [] }`,
          },
        ],
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = extractJson(text) as { issues?: Issue[] };
    return (parsed.issues ?? []).map(i => ({
      type: 'gameplay' as CheckerName,
      severity: i.severity,
      message: i.message,
      screen: state.url,
    }));
  }

  async analyzeNarrative(
    state: GameState,
    previousScreenText: string,
    chapterContext: string,
  ): Promise<PartialAnomaly[]> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: state.screenshot },
          },
          {
            type: 'text',
            text: `Serious game anticorruption — Contexte : "${chapterContext}"

Texte écran précédent :
${previousScreenText.slice(0, 600)}

Texte écran actuel :
${state.visibleText.slice(0, 800)}

TÂCHE : Identifie les incohérences narratives :
1. Contradictions entre le texte précédent et actuel
2. Nom d'un personnage qui change sans raison
3. Références à des événements qui n'ont pas eu lieu
4. Placeholder non substitué ({prenom}, [NOM], etc.)
5. Texte tronqué en milieu de phrase
6. Rupture de ton (tutoiement ↔ vouvoiement)

NE PAS signaler : dialogues intentionnellement familiers, balises HTML résiduelles.

Réponds UNIQUEMENT en JSON : { "issues": [{ "severity": "major|minor", "message": "..." }] }
Si aucun problème : { "issues": [] }`,
          },
        ],
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = extractJson(text) as { issues?: Issue[] };
    return (parsed.issues ?? []).map(i => ({
      type: 'narrative' as CheckerName,
      severity: i.severity,
      message: i.message,
      screen: state.url,
    }));
  }

  async analyzeSpelling(texts: Array<{ screen: string; text: string }>): Promise<Array<{ screen: string; issues: string[] }>> {
    const batch = texts
      .map((t, i) => `=== ÉCRAN ${i + 1} (${t.screen}) ===\n${t.text.slice(0, 600)}`)
      .join('\n\n');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Tu vérifies la qualité du français dans un serious game de formation anticorruption (registre professionnel, public : agents SEM).

Textes à analyser :
${batch}

TÂCHE : Pour chaque écran, liste les problèmes :
- Fautes d'orthographe ou de grammaire
- Accords incorrects (genre, nombre)
- Ponctuation française non respectée (espace avant : ; ? !)
- Termes juridiques mal employés (prise illégale d'intérêts, favoritisme, etc.)
- Niveau de langue inapproprié pour le contexte professionnel

NE PAS signaler : dialogue familier intentionnel des personnages, balises HTML (em, strong).

Réponds UNIQUEMENT en JSON :
{ "results": [{ "screenIndex": 0, "issues": ["..."] }, { "screenIndex": 1, "issues": [] }] }`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = extractJson(text) as { results?: Array<{ screenIndex: number; issues: string[] }> };
    return (parsed.results ?? []).map(r => ({
      screen: texts[r.screenIndex]?.screen ?? 'unknown',
      issues: r.issues ?? [],
    }));
  }

  async analyzeResponsive(
    state: GameState,
    viewport: { width: number; height: number },
  ): Promise<PartialAnomaly[]> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: state.screenshot },
          },
          {
            type: 'text',
            text: `Viewport : ${viewport.width}×${viewport.height}px. Jeu : serious game HTML/CSS vanilla.

TÂCHE : Identifie les problèmes visuels à ce viewport :
1. Texte débordant hors de son conteneur
2. Boutons trop petits pour être touchés (cible tactile < 44px) — critique sur mobile
3. Scroll horizontal non voulu
4. Éléments UI superposés (overlap involontaire)
5. Texte illisible (taille trop petite, contraste insuffisant)
6. Layout cassé (éléments en dehors du viewport)

Réponds UNIQUEMENT en JSON : { "issues": [{ "severity": "critical|major|minor", "message": "..." }] }
Si aucun problème : { "issues": [] }`,
          },
        ],
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = extractJson(text) as { issues?: Issue[] };
    return (parsed.issues ?? []).map(i => ({
      type: 'responsive' as CheckerName,
      severity: i.severity,
      message: `[${viewport.width}×${viewport.height}] ${i.message}`,
      screen: state.url,
    }));
  }
}

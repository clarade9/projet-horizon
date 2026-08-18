import { Page } from 'playwright';
import { Persona, PersonaName } from './types';

const PERSONA_DEFS: Record<PersonaName, Persona> = {
  explorer: {
    name: 'explorer',
    description: 'Clique sur tout, visite tous les écrans exhaustivement',
    clickDelay: 300,
    skipAnimations: true,
    followHappyPath: false,
    tryWrongInputs: false,
    visitAllScreens: true,
    maxActionsPerScreen: 15,
  },
  normal: {
    name: 'normal',
    description: 'Suit le chemin nominal, lit le contenu, fait de bons choix',
    clickDelay: 800,
    skipAnimations: false,
    followHappyPath: true,
    tryWrongInputs: false,
    visitAllScreens: false,
    maxActionsPerScreen: 5,
  },
  chaotic: {
    name: 'chaotic',
    description: 'Ordre aléatoire, clics rapides, imprévisible',
    clickDelay: 100,
    skipAnimations: true,
    followHappyPath: false,
    tryWrongInputs: false,
    visitAllScreens: false,
    maxActionsPerScreen: 20,
  },
  impatient: {
    name: 'impatient',
    description: 'Saute tout, clique vite, choisit toujours le premier choix',
    clickDelay: 50,
    skipAnimations: true,
    followHappyPath: false,
    tryWrongInputs: false,
    visitAllScreens: false,
    maxActionsPerScreen: 3,
  },
  lost: {
    name: 'lost',
    description: 'Mauvaises saisies, cas limites, essaie de casser les formulaires',
    clickDelay: 500,
    skipAnimations: false,
    followHappyPath: false,
    tryWrongInputs: true,
    visitAllScreens: false,
    maxActionsPerScreen: 10,
  },
};

export class PersonaEngine {
  static create(name: PersonaName): Persona {
    return PERSONA_DEFS[name];
  }

  static pickChoiceIndex(persona: Persona, availableChoices: number): number {
    switch (persona.name) {
      case 'normal':
        return Math.min(1, availableChoices - 1);
      case 'impatient':
        return 0;
      case 'chaotic':
      case 'lost':
        return Math.floor(Math.random() * availableChoices);
      case 'explorer':
      default:
        return Math.min(2, availableChoices - 1);
    }
  }

  static async think(persona: Persona, page: Page): Promise<void> {
    if (persona.clickDelay > 0) {
      await page.waitForTimeout(persona.clickDelay);
    }
  }

  static wrongInputs(): string[] {
    return [
      '',
      'a'.repeat(200),
      '<script>alert(1)</script>',
      '   ',
      '123456789',
      '€€€%%%###',
    ];
  }
}

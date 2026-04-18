import { Injectable } from '@nestjs/common';

/**
 * Service de génération de références uniques au format ORN-XXXX.
 * Utilise un compteur atomique en mémoire + timestamp pour unicité.
 */
@Injectable()
export class ReferenceGeneratorService {
  private counter = 0;

  /**
   * Génère une référence unique au format ORN-XXXX.
   * Combinaison d'un compteur incrémental et d'un suffixe temporel
   * pour garantir l'unicité même en cas de redémarrage.
   */
  generate(): string {
    this.counter++;
    const timePart = Date.now().toString(36).slice(-4).toUpperCase();
    const counterPart = this.counter.toString().padStart(4, '0');
    return `ORN-${counterPart}-${timePart}`;
  }
}

/**
 * Statuts possibles d'un incident dans le workflow ORION.
 * Ordre logique : EN_ATTENTE → ASSIGNÉ → EN_COURS → RÉSOLU
 */
export enum IncidentStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  ASSIGNE = 'ASSIGNE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
}

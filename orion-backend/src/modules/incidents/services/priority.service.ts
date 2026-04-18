import { Injectable } from '@nestjs/common';
import { IncidentType, UrgencyLevel, PriorityLevel } from '../../../common/enums';

/**
 * Service de calcul de priorité.
 * Détermine automatiquement la priorité d'un incident
 * en croisant son type et son niveau d'urgence.
 */
@Injectable()
export class PriorityService {
  /**
   * Matrice de priorité : Type × Urgence → Priorité
   *
   * Les incidents SECURITE et MEDICAL sont naturellement
   * escaladés d'un cran par rapport aux autres types.
   */
  private readonly priorityMatrix: Record<IncidentType, Record<UrgencyLevel, PriorityLevel>> = {
    [IncidentType.SECURITE]: {
      [UrgencyLevel.CRITIQUE]: PriorityLevel.P1_CRITIQUE,
      [UrgencyLevel.HAUTE]: PriorityLevel.P1_CRITIQUE,
      [UrgencyLevel.MOYENNE]: PriorityLevel.P2_HAUTE,
      [UrgencyLevel.BASSE]: PriorityLevel.P3_MOYENNE,
    },
    [IncidentType.MEDICAL]: {
      [UrgencyLevel.CRITIQUE]: PriorityLevel.P1_CRITIQUE,
      [UrgencyLevel.HAUTE]: PriorityLevel.P1_CRITIQUE,
      [UrgencyLevel.MOYENNE]: PriorityLevel.P2_HAUTE,
      [UrgencyLevel.BASSE]: PriorityLevel.P3_MOYENNE,
    },
    [IncidentType.TECHNIQUE]: {
      [UrgencyLevel.CRITIQUE]: PriorityLevel.P1_CRITIQUE,
      [UrgencyLevel.HAUTE]: PriorityLevel.P2_HAUTE,
      [UrgencyLevel.MOYENNE]: PriorityLevel.P3_MOYENNE,
      [UrgencyLevel.BASSE]: PriorityLevel.P4_BASSE,
    },
    [IncidentType.LOGISTIQUE]: {
      [UrgencyLevel.CRITIQUE]: PriorityLevel.P2_HAUTE,
      [UrgencyLevel.HAUTE]: PriorityLevel.P2_HAUTE,
      [UrgencyLevel.MOYENNE]: PriorityLevel.P3_MOYENNE,
      [UrgencyLevel.BASSE]: PriorityLevel.P4_BASSE,
    },
    [IncidentType.AUTRE]: {
      [UrgencyLevel.CRITIQUE]: PriorityLevel.P2_HAUTE,
      [UrgencyLevel.HAUTE]: PriorityLevel.P3_MOYENNE,
      [UrgencyLevel.MOYENNE]: PriorityLevel.P3_MOYENNE,
      [UrgencyLevel.BASSE]: PriorityLevel.P4_BASSE,
    },
  };

  /**
   * Calcule la priorité d'un incident.
   */
  calculate(type: IncidentType, urgence: UrgencyLevel): PriorityLevel {
    return this.priorityMatrix[type]?.[urgence] ?? PriorityLevel.P3_MOYENNE;
  }
}

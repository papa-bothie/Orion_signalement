import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../entities/incident.entity';
import { HistoriqueAction } from '../../historique/entities/historique-action.entity';
import { CreateIncidentDto, UpdateIncidentDto, FilterIncidentDto } from '../dto';
import { IncidentStatus } from '../../../common/enums';
import { PriorityService } from './priority.service';
import { ReferenceGeneratorService } from './reference-generator.service';
import { OrionGateway } from '../../websocket/orion.gateway';

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name);

  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    @InjectRepository(HistoriqueAction)
    private readonly historiqueRepository: Repository<HistoriqueAction>,
    private readonly priorityService: PriorityService,
    private readonly referenceGenerator: ReferenceGeneratorService,
    private readonly orionGateway: OrionGateway,  // ← WebSocket
  ) {}

  // ─────────────────────────────────────────────────────────────
  //  CRÉATION (Citoyen)
  // ─────────────────────────────────────────────────────────────

  /**
   * Crée un nouvel incident à partir des données du citoyen.
   * - Génère une référence unique ORN-XXXX
   * - Calcule la priorité via la matrice type × urgence
   * - Initialise le statut à EN_ATTENTE
   * - Enregistre la première entrée d'historique
   */
  async create(dto: CreateIncidentDto): Promise<Incident> {
    const reference = this.referenceGenerator.generate();
    const priorite = this.priorityService.calculate(dto.type, dto.urgence);

    const incident = this.incidentRepository.create({
      reference,
      description: dto.description,
      type: dto.type,
      urgence: dto.urgence,
      priorite,
      statut: IncidentStatus.EN_ATTENTE,
      latitude: dto.latitude,
      longitude: dto.longitude,
      adresse: dto.adresse,
      mediaUrl: dto.mediaUrl,
      reporterNom: dto.reporterNom,
      reporterTelephone: dto.reporterTelephone,
    });

    const savedIncident = await this.incidentRepository.save(incident);

    // Première entrée dans l'historique
    await this.addHistoriqueEntry(
      savedIncident.id,
      'CREATION',
      `Incident ${reference} créé avec priorité ${priorite}`,
      dto.reporterNom || 'Citoyen anonyme',
    );

    this.logger.log(`Incident créé : ${reference} | Type: ${dto.type} | Priorité: ${priorite}`);

    const fullIncident = await this.findOne(savedIncident.id);

    // ── Notification temps réel → Dashboard ──────────────────
    this.orionGateway.notifyNewIncident(fullIncident);

    return fullIncident;
  }

  // ─────────────────────────────────────────────────────────────
  //  LECTURE (Dashboard)
  // ─────────────────────────────────────────────────────────────

  /**
   * Récupère la liste des incidents avec filtres et pagination.
   */
  async findAll(
    filters: FilterIncidentDto,
  ): Promise<{ incidents: Incident[]; total: number; page: number; totalPages: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.incidentRepository
      .createQueryBuilder('incident')
      .leftJoinAndSelect('incident.agentAssigne', 'agent')
      .orderBy('incident.dateCreation', 'DESC');

    // Application des filtres dynamiques
    if (filters.statut) {
      queryBuilder.andWhere('incident.statut = :statut', { statut: filters.statut });
    }
    if (filters.type) {
      queryBuilder.andWhere('incident.type = :type', { type: filters.type });
    }
    if (filters.urgence) {
      queryBuilder.andWhere('incident.urgence = :urgence', { urgence: filters.urgence });
    }
    if (filters.priorite) {
      queryBuilder.andWhere('incident.priorite = :priorite', { priorite: filters.priorite });
    }

    const [incidents, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      incidents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupère un incident par son ID avec toutes ses relations.
   */
  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['agentAssigne', 'historique'],
      order: { historique: { dateAction: 'DESC' } },
    });

    if (!incident) {
      throw new NotFoundException(`Incident avec l'ID "${id}" introuvable.`);
    }

    return incident;
  }

  /**
   * Récupère un incident par sa référence ORN-XXXX.
   */
  async findByReference(reference: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { reference },
      relations: ['agentAssigne', 'historique'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident avec la référence "${reference}" introuvable.`);
    }

    return incident;
  }

  // ─────────────────────────────────────────────────────────────
  //  MISE À JOUR (Dashboard)
  // ─────────────────────────────────────────────────────────────

  /**
   * Met à jour un incident existant.
   * - Valide les transitions de statut
   * - Recalcule la priorité si urgence/type changent
   * - Enregistre chaque modification dans l'historique
   */
  async update(id: string, dto: UpdateIncidentDto, utilisateur: string = 'Dashboard'): Promise<Incident> {
    const incident = await this.findOne(id);
    const changes: string[] = [];

    // Transition de statut
    if (dto.statut && dto.statut !== incident.statut) {
      this.validateStatusTransition(incident.statut, dto.statut);
      changes.push(`Statut: ${incident.statut} → ${dto.statut}`);
      incident.statut = dto.statut;
    }

    // Assignation d'agent
    if (dto.agentAssigneId !== undefined) {
      if (dto.agentAssigneId) {
        changes.push(`Agent assigné: ${dto.agentAssigneId}`);
        incident.agentAssigneId = dto.agentAssigneId;
        // Auto-passer en ASSIGNÉ si encore EN_ATTENTE
        if (incident.statut === IncidentStatus.EN_ATTENTE) {
          incident.statut = IncidentStatus.ASSIGNE;
          changes.push(`Statut: EN_ATTENTE → ASSIGNE (auto)`);
        }
      } else {
        changes.push('Agent désassigné');
        incident.agentAssigneId = undefined;
      }
    }

    // Mise à jour type/urgence → recalcul priorité
    if (dto.type || dto.urgence) {
      const newType = dto.type || incident.type;
      const newUrgence = dto.urgence || incident.urgence;
      const newPriorite = this.priorityService.calculate(newType, newUrgence);

      if (dto.type) {
        changes.push(`Type: ${incident.type} → ${dto.type}`);
        incident.type = dto.type;
      }
      if (dto.urgence) {
        changes.push(`Urgence: ${incident.urgence} → ${dto.urgence}`);
        incident.urgence = dto.urgence;
      }
      if (newPriorite !== incident.priorite) {
        changes.push(`Priorité recalculée: ${incident.priorite} → ${newPriorite}`);
        incident.priorite = newPriorite;
      }
    }

    if (dto.description) {
      changes.push('Description mise à jour');
      incident.description = dto.description;
    }

    if (changes.length === 0) {
      return incident;
    }

    const updatedIncident = await this.incidentRepository.save(incident);

    // Enregistrer dans l'historique
    await this.addHistoriqueEntry(
      id,
      'MISE_A_JOUR',
      changes.join(' | '),
      utilisateur,
    );

    this.logger.log(`Incident ${incident.reference} mis à jour : ${changes.join(', ')}`);

    const fullUpdated = await this.findOne(updatedIncident.id);

    // ── Notification temps réel → Dashboard ──────────────────
    if (dto.agentAssigneId) {
      this.orionGateway.notifyIncidentAssigned(fullUpdated);
    } else {
      this.orionGateway.notifyIncidentUpdated(fullUpdated);
    }

    return fullUpdated;
  }

  // ─────────────────────────────────────────────────────────────
  //  HISTORIQUE
  // ─────────────────────────────────────────────────────────────

  /**
   * Récupère l'historique complet d'un incident.
   */
  async getHistorique(incidentId: string): Promise<HistoriqueAction[]> {
    // Vérifier que l'incident existe
    await this.findOne(incidentId);

    return this.historiqueRepository.find({
      where: { incidentId },
      order: { dateAction: 'DESC' },
    });
  }

  // ─────────────────────────────────────────────────────────────
  //  STATISTIQUES (Dashboard)
  // ─────────────────────────────────────────────────────────────

  /**
   * Retourne les compteurs par statut pour le dashboard.
   */
  async getStatistics(): Promise<Record<string, unknown>> {
    const total = await this.incidentRepository.count();

    const parStatut = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.statut', 'statut')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.statut')
      .getRawMany();

    const parType = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.type')
      .getRawMany();

    const parPriorite = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.priorite', 'priorite')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.priorite')
      .getRawMany();

    return { total, parStatut, parType, parPriorite };
  }

  // ─────────────────────────────────────────────────────────────
  //  MÉTHODES PRIVÉES
  // ─────────────────────────────────────────────────────────────

  /**
   * Valide qu'une transition de statut est autorisée.
   * Transitions valides :
   *   EN_ATTENTE → ASSIGNÉ
   *   ASSIGNÉ → EN_COURS
   *   EN_COURS → RÉSOLU
   *   (toute régression est interdite)
   */
  private validateStatusTransition(current: IncidentStatus, next: IncidentStatus): void {
    const validTransitions: Record<IncidentStatus, IncidentStatus[]> = {
      [IncidentStatus.EN_ATTENTE]: [IncidentStatus.ASSIGNE],
      [IncidentStatus.ASSIGNE]: [IncidentStatus.EN_COURS, IncidentStatus.EN_ATTENTE],
      [IncidentStatus.EN_COURS]: [IncidentStatus.RESOLU, IncidentStatus.ASSIGNE],
      [IncidentStatus.RESOLU]: [],
    };

    const allowed = validTransitions[current] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Transition de statut invalide : ${current} → ${next}. ` +
        `Transitions autorisées depuis ${current} : [${allowed.join(', ')}].`,
      );
    }
  }

  /**
   * Ajoute une entrée dans l'historique des actions.
   */
  private async addHistoriqueEntry(
    incidentId: string,
    action: string,
    details: string,
    utilisateur: string,
  ): Promise<HistoriqueAction> {
    const entry = this.historiqueRepository.create({
      incidentId,
      action,
      details,
      utilisateur,
    });
    return this.historiqueRepository.save(entry);
  }
}

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto, UpdateAgentDto } from '../dto/agent.dto';
import { AgentStatus } from '../../../common/enums';
import { Incident } from '../../incidents/entities/incident.entity';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  /**
   * Crée un nouvel agent ORION.
   */
  async create(dto: CreateAgentDto): Promise<Agent> {
    const agent = this.agentRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      telephone: dto.telephone,
      statut: AgentStatus.DISPONIBLE,
    });

    const savedAgent = await this.agentRepository.save(agent);
    this.logger.log(`Agent créé : ${savedAgent.nom} (${savedAgent.id})`);
    return savedAgent;
  }

  /**
   * Récupère tous les agents.
   */
  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find({
      order: { dateCreation: 'DESC' },
    });
  }

  /**
   * Récupère un agent par son ID.
   */
  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['incidents'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent avec l'ID "${id}" introuvable.`);
    }

    return agent;
  }

  /**
   * Met à jour un agent.
   */
  async update(id: string, dto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);
    Object.assign(agent, dto);
    return this.agentRepository.save(agent);
  }

  /**
   * Récupère les agents disponibles.
   */
  async findAvailable(): Promise<Agent[]> {
    return this.agentRepository.find({
      where: { statut: AgentStatus.DISPONIBLE },
    });
  }

  /**
   * Récupère les missions (incidents) assignées à un agent.
   */
  async findMissions(agentId: string): Promise<Incident[]> {
    // Vérifie d'abord que l'agent existe
    await this.findOne(agentId);

    return this.incidentRepository.find({
      where: { agentAssigneId: agentId },
      order: { dateCreation: 'DESC' },
    });
  }
}

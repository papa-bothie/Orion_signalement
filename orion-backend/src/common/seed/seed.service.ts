import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Agent } from '../../modules/agents/entities/agent.entity';
import { AgentStatus } from '../enums';

/**
 * Service de seed exécuté au démarrage en mode développement.
 * Insère des données de test si la base est vide.
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const env = this.configService.get<string>('APP_ENV');
    if (env !== 'development') {
      return;
    }

    const agentCount = await this.agentRepository.count();
    if (agentCount > 0) {
      this.logger.log('Base déjà peuplée — seed ignoré.');
      return;
    }

    this.logger.log('Insertion des données de test…');
    await this.seedAgents();
    this.logger.log('✅ Seed terminé.');
  }

  private async seedAgents(): Promise<void> {
    const agents = [
      { nom: 'Diop', prenom: 'Ousmane', email: 'ousmane.diop@orion.sn', telephone: '+221 76 100 00 01', statut: AgentStatus.DISPONIBLE },
      { nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou.ndiaye@orion.sn', telephone: '+221 76 100 00 02', statut: AgentStatus.DISPONIBLE },
      { nom: 'Fall', prenom: 'Ibrahima', email: 'ibrahima.fall@orion.sn', telephone: '+221 76 100 00 03', statut: AgentStatus.DISPONIBLE },
      { nom: 'Sarr', prenom: 'Aminata', email: 'aminata.sarr@orion.sn', telephone: '+221 76 100 00 04', statut: AgentStatus.EN_MISSION },
      { nom: 'Sow', prenom: 'Cheikh', email: 'cheikh.sow@orion.sn', telephone: '+221 76 100 00 05', statut: AgentStatus.HORS_LIGNE },
    ];

    for (const agentData of agents) {
      const agent = this.agentRepository.create(agentData);
      await this.agentRepository.save(agent);
    }

    this.logger.log(`${agents.length} agents créés.`);
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { IncidentStatus, IncidentType, UrgencyLevel, PriorityLevel } from '../../../common/enums';
import { Agent } from '../../agents/entities/agent.entity';
import { HistoriqueAction } from '../../historique/entities/historique-action.entity';

@Entity('incidents')
@Index(['statut', 'urgence', 'type'])
@Index(['dateCreation'])
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Référence unique lisible au format ORN-XXXX.
   * Générée automatiquement par le service.
   */
  @Column({ type: 'varchar', length: 20, unique: true })
  reference!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: IncidentType })
  type!: IncidentType;

  @Column({ type: 'enum', enum: UrgencyLevel })
  urgence!: UrgencyLevel;

  @Column({ type: 'enum', enum: PriorityLevel })
  priorite!: PriorityLevel;

  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.EN_ATTENTE })
  statut!: IncidentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  adresse?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mediaUrl?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reporterNom?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  reporterTelephone?: string;

  @ManyToOne(() => Agent, (agent) => agent.incidents, { nullable: true, eager: false })
  @JoinColumn({ name: 'agent_assigne_id' })
  agentAssigne?: Agent;

  @Column({ name: 'agent_assigne_id', nullable: true })
  agentAssigneId?: string;

  @OneToMany(() => HistoriqueAction, (historique) => historique.incident, { cascade: true })
  historique!: HistoriqueAction[];

  @CreateDateColumn({ name: 'date_creation' })
  dateCreation!: Date;

  @UpdateDateColumn({ name: 'date_mise_a_jour' })
  dateMiseAJour!: Date;
}

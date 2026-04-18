import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AgentStatus } from '../../../common/enums';
import { Incident } from '../../incidents/entities/incident.entity';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nom!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  prenom?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone?: string;

  @Column({ type: 'enum', enum: AgentStatus, default: AgentStatus.DISPONIBLE })
  statut!: AgentStatus;

  @OneToMany(() => Incident, (incident) => incident.agentAssigne)
  incidents!: Incident[];

  @CreateDateColumn({ name: 'date_creation' })
  dateCreation!: Date;
}

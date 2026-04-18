import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Incident } from '../../incidents/entities/incident.entity';

@Entity('historique_actions')
export class HistoriqueAction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Incident, (incident) => incident.historique, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'incident_id' })
  incident!: Incident;

  @Column({ name: 'incident_id' })
  incidentId!: string;

  @Column({ type: 'varchar', length: 255 })
  action!: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'varchar', length: 100 })
  utilisateur!: string;

  @CreateDateColumn({ name: 'date_action' })
  dateAction!: Date;
}

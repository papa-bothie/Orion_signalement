import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentStatus } from '../../../common/enums/incident-status.enum';
import { IncidentType } from '../../../common/enums/incident-type.enum';
import { UrgencyLevel } from '../../../common/enums/urgency-level.enum';

/**
 * DTO de mise à jour d'un incident (usage dashboard).
 * Tous les champs sont optionnels.
 */
export class UpdateIncidentDto {
  @ApiPropertyOptional({ description: 'Nouveau statut', enum: IncidentStatus })
  @IsOptional()
  @IsEnum(IncidentStatus, { message: 'Statut invalide.' })
  statut?: IncidentStatus;

  @ApiPropertyOptional({ description: 'Nouveau type', enum: IncidentType })
  @IsOptional()
  @IsEnum(IncidentType)
  type?: IncidentType;

  @ApiPropertyOptional({ description: 'Nouveau niveau d\'urgence', enum: UrgencyLevel })
  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgence?: UrgencyLevel;

  @ApiPropertyOptional({ description: 'ID de l\'agent assigné' })
  @IsOptional()
  @IsString()
  agentAssigneId?: string;

  @ApiPropertyOptional({ description: 'Description mise à jour' })
  @IsOptional()
  @IsString()
  description?: string;
}

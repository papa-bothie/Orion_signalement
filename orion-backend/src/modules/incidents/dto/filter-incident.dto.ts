import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IncidentStatus } from '../../../common/enums/incident-status.enum';
import { IncidentType } from '../../../common/enums/incident-type.enum';
import { UrgencyLevel } from '../../../common/enums/urgency-level.enum';
import { PriorityLevel } from '../../../common/enums/priority-level.enum';

/**
 * DTO pour les filtres de recherche des incidents (dashboard).
 * Paramètres passés en query string.
 */
export class FilterIncidentDto {
  @ApiPropertyOptional({ description: 'Filtrer par statut', enum: IncidentStatus })
  @IsOptional()
  @IsEnum(IncidentStatus)
  statut?: IncidentStatus;

  @ApiPropertyOptional({ description: 'Filtrer par type', enum: IncidentType })
  @IsOptional()
  @IsEnum(IncidentType)
  type?: IncidentType;

  @ApiPropertyOptional({ description: 'Filtrer par urgence', enum: UrgencyLevel })
  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgence?: UrgencyLevel;

  @ApiPropertyOptional({ description: 'Filtrer par priorité', enum: PriorityLevel })
  @IsOptional()
  @IsEnum(PriorityLevel)
  priorite?: PriorityLevel;

  @ApiPropertyOptional({ description: 'Numéro de page (pagination)', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Nombre d\'éléments par page', default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

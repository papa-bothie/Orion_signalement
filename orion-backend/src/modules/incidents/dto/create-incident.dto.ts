import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentType } from '../../../common/enums/incident-type.enum';
import { UrgencyLevel } from '../../../common/enums/urgency-level.enum';

/**
 * DTO de création d'un incident par un citoyen.
 * Valide les données entrantes avant traitement.
 */
export class CreateIncidentDto {
  @ApiProperty({
    description: 'Description détaillée de l\'incident',
    example: 'Un poteau électrique est tombé sur la route principale près du stade.',
  })
  @IsNotEmpty({ message: 'La description est obligatoire.' })
  @IsString()
  @MaxLength(2000, { message: 'La description ne peut pas dépasser 2000 caractères.' })
  description!: string;

  @ApiProperty({
    description: 'Type d\'incident',
    enum: IncidentType,
    example: IncidentType.TECHNIQUE,
  })
  @IsNotEmpty({ message: 'Le type d\'incident est obligatoire.' })
  @IsEnum(IncidentType, { message: 'Type d\'incident invalide.' })
  type!: IncidentType;

  @ApiProperty({
    description: 'Niveau d\'urgence',
    enum: UrgencyLevel,
    example: UrgencyLevel.HAUTE,
  })
  @IsNotEmpty({ message: 'Le niveau d\'urgence est obligatoire.' })
  @IsEnum(UrgencyLevel, { message: 'Niveau d\'urgence invalide.' })
  urgence!: UrgencyLevel;

  @ApiProperty({
    description: 'Latitude GPS',
    example: 14.6928,
    minimum: -90,
    maximum: 90,
  })
  @IsNotEmpty({ message: 'La latitude est obligatoire.' })
  @IsNumber({}, { message: 'La latitude doit être un nombre.' })
  @Min(-90, { message: 'La latitude doit être comprise entre -90 et 90.' })
  @Max(90, { message: 'La latitude doit être comprise entre -90 et 90.' })
  latitude!: number;

  @ApiProperty({
    description: 'Longitude GPS',
    example: -17.4467,
    minimum: -180,
    maximum: 180,
  })
  @IsNotEmpty({ message: 'La longitude est obligatoire.' })
  @IsNumber({}, { message: 'La longitude doit être un nombre.' })
  @Min(-180, { message: 'La longitude doit être comprise entre -180 et 180.' })
  @Max(180, { message: 'La longitude doit être comprise entre -180 et 180.' })
  longitude!: number;

  @ApiPropertyOptional({
    description: 'Adresse textuelle (optionnelle)',
    example: 'Avenue Cheikh Anta Diop, Dakar',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  adresse?: string;

  @ApiPropertyOptional({
    description: 'URL du média (photo/vidéo) joint au signalement',
    example: 'https://storage.orion.sn/uploads/photo_12345.jpg',
  })
  @IsOptional()
  @IsString({ message: 'L\'URL ou le chemin du média n\'est pas valide.' })
  mediaUrl?: string;

  @ApiPropertyOptional({
    description: 'Nom du citoyen signalant',
    example: 'Mamadou Diallo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reporterNom?: string;

  @ApiPropertyOptional({
    description: 'Téléphone du citoyen signalant',
    example: '+221 77 123 45 67',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  reporterTelephone?: string;
}

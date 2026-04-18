import { IsNotEmpty, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentStatus } from '../../../common/enums';

export class CreateAgentDto {
  @ApiProperty({ description: 'Nom de l\'agent', example: 'Diop' })
  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  @IsString()
  @MaxLength(100)
  nom!: string;

  @ApiPropertyOptional({ description: 'Prénom de l\'agent', example: 'Ousmane' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prenom?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'ousmane.diop@orion.sn' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Téléphone', example: '+221 76 987 65 43' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string;
}

export class UpdateAgentDto {
  @ApiPropertyOptional({ description: 'Statut', enum: AgentStatus })
  @IsOptional()
  @IsEnum(AgentStatus)
  statut?: AgentStatus;

  @ApiPropertyOptional({ description: 'Nom' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nom?: string;

  @ApiPropertyOptional({ description: 'Prénom' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prenom?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Téléphone' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telephone?: string;
}

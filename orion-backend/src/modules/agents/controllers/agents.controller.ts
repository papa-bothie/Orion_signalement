import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AgentsService } from '../services/agents.service';
import { CreateAgentDto, UpdateAgentDto } from '../dto/agent.dto';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un agent', description: 'Enregistre un nouvel agent ORION.' })
  @ApiResponse({ status: 201, description: 'Agent créé.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async create(@Body() dto: CreateAgentDto) {
    const agent = await this.agentsService.create(dto);
    return { message: 'Agent créé avec succès.', agent };
  }

  @Get()
  @ApiOperation({ summary: 'Liste des agents', description: 'Récupère la liste de tous les agents.' })
  @ApiResponse({ status: 200, description: 'Liste des agents.' })
  async findAll() {
    return this.agentsService.findAll();
  }

  @Get('disponibles')
  @ApiOperation({ summary: 'Agents disponibles', description: 'Récupère les agents actuellement disponibles.' })
  @ApiResponse({ status: 200, description: 'Liste des agents disponibles.' })
  async findAvailable() {
    return this.agentsService.findAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un agent' })
  @ApiParam({ name: 'id', description: 'UUID de l\'agent' })
  @ApiResponse({ status: 200, description: 'Détails de l\'agent.' })
  @ApiResponse({ status: 404, description: 'Agent introuvable.' })
  async findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Get(':id/missions')
  @ApiOperation({ summary: 'Missions d\'un agent', description: 'Récupère les incidents assignés à un agent.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'agent' })
  @ApiResponse({ status: 200, description: 'Liste des missions de l\'agent.' })
  @ApiResponse({ status: 404, description: 'Agent introuvable.' })
  async findMissions(@Param('id') id: string) {
    return this.agentsService.findMissions(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un agent' })
  @ApiParam({ name: 'id', description: 'UUID de l\'agent' })
  @ApiResponse({ status: 200, description: 'Agent mis à jour.' })
  @ApiResponse({ status: 404, description: 'Agent introuvable.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
  ) {
    const agent = await this.agentsService.update(id, dto);
    return { message: 'Agent mis à jour.', agent };
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IncidentsService } from '../services/incidents.service';
import { CreateIncidentDto, UpdateIncidentDto, FilterIncidentDto } from '../dto';

@ApiTags('Incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  // ──────────────────────────────────────────────────────
  //  📱 ENDPOINTS CITOYEN
  // ──────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un signalement',
    description: 'Permet à un citoyen de signaler un incident. '
      + 'Le backend génère automatiquement une référence ORN-XXXX, '
      + 'calcule la priorité et initialise le statut à EN_ATTENTE.',
  })
  @ApiResponse({ status: 201, description: 'Incident créé avec succès. Retourne l\'accusé de réception.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async create(@Body() createIncidentDto: CreateIncidentDto) {
    const incident = await this.incidentsService.create(createIncidentDto);
    return {
      message: 'Signalement enregistré avec succès.',
      reference: incident.reference,
      incident,
    };
  }

  // ──────────────────────────────────────────────────────
  //  💻 ENDPOINTS DASHBOARD
  // ──────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Liste des incidents',
    description: 'Récupère la liste paginée des incidents avec filtres optionnels.',
  })
  @ApiResponse({ status: 200, description: 'Liste des incidents récupérée.' })
  async findAll(@Query() filters: FilterIncidentDto) {
    return this.incidentsService.findAll(filters);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Statistiques des incidents',
    description: 'Retourne les compteurs par statut, type et priorité.',
  })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées.' })
  async getStatistics() {
    return this.incidentsService.getStatistics();
  }

  @Get('reference/:reference')
  @ApiOperation({
    summary: 'Rechercher par référence',
    description: 'Récupère un incident par sa référence ORN-XXXX.',
  })
  @ApiParam({ name: 'reference', description: 'Référence unique (ex: ORN-0001-A1B2)', example: 'ORN-0001-A1B2' })
  @ApiResponse({ status: 200, description: 'Incident trouvé.' })
  @ApiResponse({ status: 404, description: 'Incident introuvable.' })
  async findByReference(@Param('reference') reference: string) {
    return this.incidentsService.findByReference(reference);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Détails d\'un incident',
    description: 'Récupère les détails complets d\'un incident, incluant l\'agent assigné et l\'historique.',
  })
  @ApiParam({ name: 'id', description: 'UUID de l\'incident' })
  @ApiResponse({ status: 200, description: 'Détails de l\'incident.' })
  @ApiResponse({ status: 404, description: 'Incident introuvable.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Mettre à jour un incident',
    description: 'Met à jour le statut, l\'assignation ou d\'autres champs d\'un incident. '
      + 'Les transitions de statut sont validées. L\'historique est mis à jour automatiquement.',
  })
  @ApiParam({ name: 'id', description: 'UUID de l\'incident' })
  @ApiResponse({ status: 200, description: 'Incident mis à jour.' })
  @ApiResponse({ status: 400, description: 'Transition de statut invalide ou données incorrectes.' })
  @ApiResponse({ status: 404, description: 'Incident introuvable.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ) {
    const incident = await this.incidentsService.update(id, updateIncidentDto);
    return {
      message: 'Incident mis à jour avec succès.',
      incident,
    };
  }

  @Get(':id/historique')
  @ApiOperation({
    summary: 'Historique d\'un incident',
    description: 'Récupère l\'historique complet des actions effectuées sur un incident.',
  })
  @ApiParam({ name: 'id', description: 'UUID de l\'incident' })
  @ApiResponse({ status: 200, description: 'Historique récupéré.' })
  @ApiResponse({ status: 404, description: 'Incident introuvable.' })
  async getHistorique(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidentsService.getHistorique(id);
  }
}

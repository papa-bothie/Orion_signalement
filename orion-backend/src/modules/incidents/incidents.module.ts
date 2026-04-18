import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { HistoriqueAction } from '../historique/entities/historique-action.entity';
import { IncidentsController } from './controllers/incidents.controller';
import { IncidentsService } from './services/incidents.service';
import { PriorityService } from './services/priority.service';
import { ReferenceGeneratorService } from './services/reference-generator.service';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, HistoriqueAction]),
    WebSocketModule, // ← Pour accéder à OrionGateway dans IncidentsService
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, PriorityService, ReferenceGeneratorService],
  exports: [IncidentsService],
})
export class IncidentsModule {}

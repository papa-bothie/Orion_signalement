import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { Incident } from '../incidents/entities/incident.entity';
import { AgentsController } from './controllers/agents.controller';
import { AgentsService } from './services/agents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Incident])],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { AgentsModule } from './modules/agents/agents.module';
import { SeedModule } from './common/seed/seed.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { Incident } from './modules/incidents/entities/incident.entity';
import { Agent } from './modules/agents/entities/agent.entity';
import { HistoriqueAction } from './modules/historique/entities/historique-action.entity';

@Module({
  imports: [
    // ── Configuration ──────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── Base de données PostgreSQL ─────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'orion_user'),
        password: configService.get<string>('DB_PASSWORD', 'orion_secret_2026'),
        database: configService.get<string>('DB_NAME', 'orion_signalement'),
        entities: [Incident, Agent, HistoriqueAction],
        synchronize: configService.get<string>('APP_ENV') === 'development',
        logging: configService.get<string>('APP_ENV') === 'development',
      }),
    }),

    // ── Modules métier ─────────────────────────────────────
    WebSocketModule,   // ← Gateway temps réel (doit être en premier)
    IncidentsModule,
    AgentsModule,
    SeedModule,
  ],
})
export class AppModule {}

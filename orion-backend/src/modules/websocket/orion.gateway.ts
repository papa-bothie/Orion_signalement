// ============================================================
// ORION — WebSocket Gateway
// Diffuse les événements temps réel vers le dashboard
// ============================================================

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * Gateway WebSocket ORION.
 *
 * Rôle :
 *  - Maintenir la connexion avec le dashboard temps réel
 *  - Émettre 'incident:new' dès qu'un signalement mobile arrive
 *  - Émettre 'incident:updated' lors d'une mise à jour
 *
 * Flux :
 *   App mobile → POST /api/v1/incidents → IncidentsService.create()
 *     → OrionGateway.notifyNewIncident()
 *       → Dashboard reçoit 'incident:new' instantanément
 */
@WebSocketGateway({
  cors: {
    origin: '*', // En production, limiter aux origines autorisées
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Même port que le serveur HTTP (NestJS le gère automatiquement)
})
export class OrionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrionGateway.name);

  // ─── Cycle de vie des connexions ───────────────────────────

  handleConnection(client: Socket) {
    this.logger.log(`[WS] Client connecté  : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[WS] Client déconnecté: ${client.id}`);
  }

  // ─── Abonnement dashboard ──────────────────────────────────

  /**
   * Le dashboard s'annonce après connexion.
   * On lui envoie une confirmation.
   */
  @SubscribeMessage('dashboard:subscribe')
  handleDashboardSubscribe(client: Socket) {
    this.logger.log(`[WS] Dashboard abonné : ${client.id}`);
    client.emit('dashboard:ack', {
      message: 'Connexion ORION WebSocket établie ✓',
      timestamp: new Date().toISOString(),
    });
  }

  // ─── Émetteurs d'événements (appelés par IncidentsService) ─

  /**
   * Notifie tous les clients d'un nouvel incident.
   * Appelé par IncidentsService.create() après sauvegarde BDD.
   */
  notifyNewIncident(incident: unknown) {
    this.logger.log(`[WS] Émission incident:new → ${JSON.stringify(incident)}`);
    this.server.emit('incident:new', incident);
  }

  /**
   * Notifie tous les clients d'une mise à jour d'incident.
   * Appelé par IncidentsService.update() après sauvegarde BDD.
   */
  notifyIncidentUpdated(incident: unknown) {
    this.logger.log(`[WS] Émission incident:updated`);
    this.server.emit('incident:updated', incident);
  }

  /**
   * Notifie d'un incident assigné à un agent.
   */
  notifyIncidentAssigned(incident: unknown) {
    this.logger.log(`[WS] Émission incident:assigned`);
    this.server.emit('incident:assigned', incident);
  }
}

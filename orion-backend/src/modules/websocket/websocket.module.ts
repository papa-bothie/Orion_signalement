// ============================================================
// ORION — Module WebSocket
// ============================================================

import { Module } from '@nestjs/common';
import { OrionGateway } from './orion.gateway';

@Module({
  providers: [OrionGateway],
  exports: [OrionGateway],  // Exporté pour être injecté dans IncidentsModule
})
export class WebSocketModule {}

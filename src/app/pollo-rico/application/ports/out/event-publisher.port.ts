import { InjectionToken } from '@angular/core';
import { Pedido } from '../../../domain/pedido.model';

/**
 * ============================================================================
 * PUERTO DE SALIDA: publicador de eventos
 * ============================================================================
 * En el diagrama, cuando "Backend Pollo Rico" crea un pedido, publica un
 * evento "Pedido Creado" en una cola de mensajería (Kafka/RabbitMQ/SQS) para
 * que "Backend TeLoLlevamos" se entere y empiece a procesar la entrega.
 *
 * Como en esta plantilla NO hay un backend real, este puerto se implementa
 * con un adaptador que SIMULA esa cola (ver
 * `simulador-telollevamos.adapter.ts`). El caso de uso que crea el pedido
 * no sabe (ni le importa) que del otro lado hay una simulación: sólo conoce
 * este contrato.
 * ============================================================================
 */

/** Evento de dominio: se dispara cuando un pedido nuevo fue creado. */
export interface EventoPedidoCreado {
  tipo: 'PedidoCreado';
  pedido: Pedido;
}

export interface EventPublisherPort {
  /** Publica el evento "Pedido Creado" hacia el exterior. */
  publicarPedidoCreado(evento: EventoPedidoCreado): void;
}

export const EVENT_PUBLISHER_PORT = new InjectionToken<EventPublisherPort>('EventPublisherPort');

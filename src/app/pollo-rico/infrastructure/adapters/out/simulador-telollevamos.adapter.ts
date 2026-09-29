import { Inject, Injectable } from '@angular/core';
import { EstadoPedido } from '../../../domain/pedido.model';
import { EventPublisherPort, EventoPedidoCreado } from '../../../application/ports/out/event-publisher.port';
import { PEDIDO_REPOSITORY_PORT, PedidoRepositoryPort } from '../../../application/ports/out/pedido-repository.port';

/**
 * ============================================================================
 * ADAPTADOR DE SALIDA: simulador de "Backend TeLoLlevamos"
 * ============================================================================
 * En el diagrama real, publicar el evento "Pedido Creado" lo manda a una
 * COLA DE MENSAJERÍA (Kafka/RabbitMQ/SQS) y del otro lado un backend
 * totalmente distinto (Backend TeLoLlevamos) lo procesa y, más adelante,
 * publica eventos de vuelta ("Pedido en proceso", "Pedido enviado al
 * cliente") que Backend Pollo Rico consume para actualizar el pedido
 * (pasos 5, 6 y 7 del diagrama).
 *
 * Como esta plantilla es SOLO frontend (no hay backend real ni cola de
 * mensajería), este adaptador SIMULA esa ida y vuelta con un par de
 * `setTimeout`, para que puedas ver en pantalla el ciclo de vida completo
 * de un pedido: CREADO -> EN_PROCESO -> ENVIADO.
 *
 * >>> IMPORTANTE PARA UN DESARROLLADOR JUNIOR <<<
 * Esto es una TRAMPA DIDÁCTICA, no un patrón a imitar en producción: aquí
 * el "publicador de eventos" termina escribiendo directamente en el
 * repositorio para simular la respuesta de otro sistema. En un proyecto
 * real, ese "otro sistema" sería un backend independiente y la
 * comunicación pasaría por HTTP/una cola de mensajería real, nunca por una
 * llamada directa en memoria como esta.
 * ============================================================================
 */
@Injectable()
export class SimuladorTeLoLlevamosAdapter implements EventPublisherPort {
  private static readonly RETRASO_EN_PROCESO_MS = 1500;
  private static readonly RETRASO_ENVIADO_MS = 3500;

  constructor(@Inject(PEDIDO_REPOSITORY_PORT) private readonly repositorioPedidos: PedidoRepositoryPort) {}

  publicarPedidoCreado(evento: EventoPedidoCreado): void {
    const { id } = evento.pedido;

    // eslint-disable-next-line no-console
    console.info(`[Cola de mensajería simulada] Evento "Pedido Creado" publicado para el pedido ${id}`);

    // Simula que "Backend TeLoLlevamos" procesa la entrega (paso 5) y
    // publica de vuelta el evento "Pedido en proceso" (paso 6).
    setTimeout(() => {
      this.repositorioPedidos.actualizarEstado(id, EstadoPedido.EN_PROCESO);
      // eslint-disable-next-line no-console
      console.info(`[Cola de mensajería simulada] Evento "Pedido en proceso" recibido para ${id}`);
    }, SimuladorTeLoLlevamosAdapter.RETRASO_EN_PROCESO_MS);

    // Simula el evento final "Pedido enviado al cliente" (paso 6-7).
    setTimeout(() => {
      this.repositorioPedidos.actualizarEstado(id, EstadoPedido.ENVIADO);
      // eslint-disable-next-line no-console
      console.info(`[Cola de mensajería simulada] Evento "Pedido enviado al cliente" recibido para ${id}`);
    }, SimuladorTeLoLlevamosAdapter.RETRASO_ENVIADO_MS);
  }
}

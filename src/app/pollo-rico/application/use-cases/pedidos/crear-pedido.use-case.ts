import { Inject, Injectable } from '@angular/core';
import { Pedido } from '../../../domain/pedido.model';
import { CrearPedidoPort, DatosNuevoPedido } from '../../ports/in/crear-pedido.port';
import { EVENT_PUBLISHER_PORT, EventPublisherPort } from '../../ports/out/event-publisher.port';
import { PEDIDO_REPOSITORY_PORT, PedidoRepositoryPort } from '../../ports/out/pedido-repository.port';
import { EstadoPedido } from '../../../domain/EstadoPedido';

/**
 * ============================================================================
 * CASO DE USO: Crear pedido
 * ============================================================================
 * Esta clase es la "Aplicación / Casos de uso" del hexágono en el diagrama.
 * Implementa el PUERTO DE ENTRADA `CrearPedidoPort` y, para hacer su
 * trabajo, depende únicamente de PUERTOS DE SALIDA (interfaces), nunca de
 * clases concretas como "InMemoryPedidoRepositoryAdapter".
 *
 * Gracias a eso, este archivo:
 *  - No sabe si los pedidos se guardan en memoria, en una API REST o en
 *    una base de datos real.
 *  - No sabe si el evento "Pedido Creado" se publica en una cola real
 *    (Kafka/RabbitMQ) o se simula con un `setTimeout`.
 *
 * Esa ignorancia deliberada es la esencia de la arquitectura hexagonal:
 * el negocio (qué hay que hacer) queda desacoplado de la infraestructura
 * (cómo se hace técnicamente).
 * ============================================================================
 */
@Injectable()
export class CrearPedidoUseCase implements CrearPedidoPort {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT) private readonly repositorioPedidos: PedidoRepositoryPort,
    @Inject(EVENT_PUBLISHER_PORT) private readonly publicadorEventos: EventPublisherPort,
  ) {}

  ejecutar(datos: DatosNuevoPedido): Pedido {
    // 1. Construir la entidad de dominio a partir de los datos de entrada.
    const pedido: Pedido = {
      id: crypto.randomUUID(),
      cliente: datos.cliente,
      producto: datos.producto,
      cantidad: datos.cantidad,
      estado: EstadoPedido.CREADO,
      creadoEn: new Date(),
    };

    // 2. Persistir el pedido a través del puerto de salida (paso 3 del diagrama).
    this.repositorioPedidos.guardar(pedido);

    // 3. Publicar el evento de dominio a través del puerto de salida
    //    (paso 3-4 del diagrama: "Publica evento Pedido Creado").
    this.publicadorEventos.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido });

    return pedido;
  }
}

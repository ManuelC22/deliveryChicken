import { Provider } from '@angular/core';
import { CONSULTAR_PEDIDOS_PORT } from './application/ports/in/consultar-pedidos.port';
import { CREAR_PEDIDO_PORT } from './application/ports/in/crear-pedido.port';
import { EVENT_PUBLISHER_PORT } from './application/ports/out/event-publisher.port';
import { PEDIDO_REPOSITORY_PORT } from './application/ports/out/pedido-repository.port';
import { ConsultarPedidosUseCase } from './application/use-cases/pedidos/consultar-pedidos.use-case';
import { CrearPedidoUseCase } from './application/use-cases/pedidos/crear-pedido.use-case';
import { InMemoryPedidoRepositoryAdapter } from './infrastructure/adapters/out/in-memory-pedido-repository.adapter';
import { SimuladorTeLoLlevamosAdapter } from './infrastructure/adapters/out/simulador-telollevamos.adapter';

/**
 * ============================================================================
 * WIRING: aquí se conecta el hexágono con el mundo exterior
 * ============================================================================
 * Este es, probablemente, el archivo MÁS IMPORTANTE para entender la
 * arquitectura hexagonal en este proyecto. Aquí le decimos a Angular:
 *
 *   "Cuando algo pida el puerto X, dale la implementación Y"
 *
 * Fíjate que:
 *  - Los PUERTOS DE ENTRADA (`CREAR_PEDIDO_PORT`, `CONSULTAR_PEDIDOS_PORT`)
 *    se resuelven con los CASOS DE USO. Son la puerta de entrada al
 *    hexágono: los componentes (adaptadores de entrada) los invocan.
 *  - Los PUERTOS DE SALIDA (`PEDIDO_REPOSITORY_PORT`, `EVENT_PUBLISHER_PORT`)
 *    se resuelven con ADAPTADORES concretos. Son la puerta de salida del
 *    hexágono: los casos de uso los invocan sin saber qué hay detrás.
 *
 * >>> CÓMO EXTENDER ESTA PLANTILLA <<<
 * Para conectar esta app a un backend real algún día, sólo tendrías que:
 *   1. Crear `HttpPedidoRepositoryAdapter` (implementando `PedidoRepositoryPort`
 *      con `HttpClient`).
 *   2. Cambiar aquí abajo `useClass: InMemoryPedidoRepositoryAdapter` por
 *      `useClass: HttpPedidoRepositoryAdapter`.
 * Ni los casos de uso ni los componentes se enterarían del cambio.
 * ============================================================================
 */
export const POLLO_RICO_PROVIDERS: Provider[] = [
  // --- Puertos de salida -> Adaptadores de salida (infraestructura) ---
  { provide: PEDIDO_REPOSITORY_PORT, useClass: InMemoryPedidoRepositoryAdapter },
  { provide: EVENT_PUBLISHER_PORT, useClass: SimuladorTeLoLlevamosAdapter },

  // --- Puertos de entrada -> Casos de uso (aplicación) ---
  { provide: CREAR_PEDIDO_PORT, useClass: CrearPedidoUseCase },
  { provide: CONSULTAR_PEDIDOS_PORT, useClass: ConsultarPedidosUseCase },
];

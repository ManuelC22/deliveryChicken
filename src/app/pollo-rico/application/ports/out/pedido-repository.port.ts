import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../domain/pedido.model';
import { EstadoPedido } from '../../../domain/EstadoPedido';

/**
 * ============================================================================
 * PUERTO DE SALIDA (output port / "driven port")
 * ============================================================================
 * Un puerto de SALIDA es un contrato que la capa de APLICACIÓN necesita que
 * el mundo exterior cumpla (una base de datos, una API, etc.).
 *
 * La aplicación (los casos de uso) sólo conoce esta interfaz, JAMÁS conoce
 * la implementación concreta. Eso es lo que permite, por ejemplo, cambiar
 * "guardar en memoria" por "guardar llamando a una API REST real" sin tocar
 * ni una línea de los casos de uso.
 *
 * En el diagrama: esto es el adaptador de salida "Repositorio de pedidos"
 * que en el mundo real habla con la "BD Pollo Rico".
 * ============================================================================
 */
export interface PedidoRepositoryPort {
  /** Persiste un pedido nuevo. */
  guardar(pedido: Pedido): void;

  /** Busca un pedido por su id. Devuelve undefined si no existe. */
  buscarPorId(id: string): Pedido | undefined;

  /** Actualiza el estado de un pedido existente. */
  actualizarEstado(id: string, nuevoEstado: EstadoPedido): void;

  /**
   * Expone el listado de pedidos de forma reactiva, para que la UI
   * (los adaptadores de entrada) se actualice sola cuando algo cambie,
   * sin tener que hacer "polling" manual.
   */
  observarPedidos(): Observable<Pedido[]>;
}

/**
 * Angular no permite inyectar una `interface` de TypeScript directamente
 * (las interfaces desaparecen al compilar). Por eso usamos un
 * `InjectionToken`: es la "llave" que usaremos para decirle a Angular
 * "cuando alguien pida un PedidoRepositoryPort, dale ESTA implementación".
 *
 * Mira `pollo-rico.providers.ts` para ver dónde se conecta el puerto con
 * su adaptador concreto (InMemoryPedidoRepositoryAdapter).
 */
export const PEDIDO_REPOSITORY_PORT = new InjectionToken<PedidoRepositoryPort>('PedidoRepositoryPort');

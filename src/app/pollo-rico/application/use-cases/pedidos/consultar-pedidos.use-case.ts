import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../domain/pedido.model';
import { ConsultarPedidosPort } from '../../ports/in/consultar-pedidos.port';
import { PEDIDO_REPOSITORY_PORT, PedidoRepositoryPort } from '../../ports/out/pedido-repository.port';

/**
 * CASO DE USO: Consultar pedidos.
 *
 * Igual que `CrearPedidoUseCase`, sólo conoce el PUERTO de salida
 * `PedidoRepositoryPort`, nunca la implementación concreta que lo resuelve.
 */
@Injectable()
export class ConsultarPedidosUseCase implements ConsultarPedidosPort {
  constructor(@Inject(PEDIDO_REPOSITORY_PORT) private readonly repositorioPedidos: PedidoRepositoryPort) {}

  observarTodos(): Observable<Pedido[]> {
    return this.repositorioPedidos.observarPedidos();
  }
}

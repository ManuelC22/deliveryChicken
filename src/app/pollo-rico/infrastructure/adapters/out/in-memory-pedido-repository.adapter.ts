import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EstadoPedido, Pedido } from '../../../domain/pedido.model';
import { PedidoRepositoryPort } from '../../../application/ports/out/pedido-repository.port';

/**
 * ============================================================================
 * ADAPTADOR DE SALIDA: repositorio en memoria
 * ============================================================================
 * Esta clase es el "Repositorio de pedidos" del diagrama, pero simulado:
 * en vez de guardar los pedidos en la "BD Pollo Rico" (una base de datos
 * real), los guarda en un array en memoria del navegador.
 *
 * Implementa el PUERTO `PedidoRepositoryPort`. Eso es lo único que le
 * importa a la aplicación: que cumpla el contrato.
 *
 * >>> PARA UN DESARROLLADOR JUNIOR <<<
 * Si mañana este proyecto necesitara hablar con un backend real, sólo
 * tendrías que crear una clase nueva, por ejemplo `HttpPedidoRepositoryAdapter`,
 * que también implemente `PedidoRepositoryPort` pero usando `HttpClient`
 * para llamar a la API REST real. Después cambiarías UNA línea en
 * `pollo-rico.providers.ts` (el `useClass`) y todo lo demás (casos de uso,
 * componentes) seguiría funcionando exactamente igual, sin tocarlo.
 * Eso es lo que hace valiosa la arquitectura hexagonal.
 * ============================================================================
 */
@Injectable()
export class InMemoryPedidoRepositoryAdapter implements PedidoRepositoryPort {
  // BehaviorSubject = "caja reactiva" de RxJS que guarda el último valor
  // emitido y lo entrega automáticamente a quien se suscriba.
  private readonly pedidos$ = new BehaviorSubject<Pedido[]>([]);

  guardar(pedido: Pedido): void {
    this.pedidos$.next([...this.pedidos$.value, pedido]);
  }

  buscarPorId(id: string): Pedido | undefined {
    return this.pedidos$.value.find((pedido) => pedido.id === id);
  }

  actualizarEstado(id: string, nuevoEstado: EstadoPedido): void {
    const pedidosActualizados = this.pedidos$.value.map((pedido) =>
      pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido,
    );
    this.pedidos$.next(pedidosActualizados);
  }

  observarPedidos(): Observable<Pedido[]> {
    return this.pedidos$.asObservable();
  }
}

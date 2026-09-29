import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../../domain/pedido.model';
import { CONSULTAR_PEDIDOS_PORT, ConsultarPedidosPort } from '../../../../application/ports/in/consultar-pedidos.port';

/**
 * ============================================================================
 * ADAPTADOR DE ENTRADA: listado del estado de los pedidos
 * ============================================================================
 * En el diagrama, esto equivale al paso 8: "Muestra el estado actualizado
 * del pedido". Este componente llama al puerto de entrada
 * `ConsultarPedidosPort` y se suscribe (vía `AsyncPipe` en el template) al
 * observable reactivo que expone.
 *
 * Como el estado se actualiza automáticamente cuando el
 * `SimuladorTeLoLlevamosAdapter` "recibe" los eventos de avance, esta
 * lista se refresca sola sin que el componente tenga que hacer nada extra.
 * ============================================================================
 */
@Component({
  selector: 'app-pedido-estado',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './pedido-estado.html',
  styleUrl: './pedido-estado.css',
})
export class PedidoEstado {
  readonly pedidos$: Observable<Pedido[]>;

  constructor(@Inject(CONSULTAR_PEDIDOS_PORT) consultarPedidos: ConsultarPedidosPort) {
    this.pedidos$ = consultarPedidos.observarTodos();
  }
}

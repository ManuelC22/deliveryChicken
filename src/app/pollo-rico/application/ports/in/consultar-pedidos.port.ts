import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../../domain/pedido.model';

/**
 * PUERTO DE ENTRADA: consultar el estado de los pedidos.
 *
 * En el diagrama corresponde al paso 8 ("Muestra el estado actualizado del
 * pedido"): el Frontend Pollo Rico necesita poder leer el estado más
 * reciente de sus pedidos para mostrarlo al cliente.
 */
export interface ConsultarPedidosPort {
  /** Lista reactiva de todos los pedidos (se actualiza sola ante cambios). */
  observarTodos(): Observable<Pedido[]>;
}

export const CONSULTAR_PEDIDOS_PORT = new InjectionToken<ConsultarPedidosPort>('ConsultarPedidosPort');

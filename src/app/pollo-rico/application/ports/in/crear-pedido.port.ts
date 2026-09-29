import { InjectionToken } from '@angular/core';
import { Pedido } from '../../../domain/pedido.model';

/**
 * ============================================================================
 * PUERTO DE ENTRADA (input port / "driving port")
 * ============================================================================
 * Un puerto de ENTRADA es el contrato que la aplicación OFRECE al exterior.
 * Los adaptadores de entrada (en nuestro caso, un componente Angular con un
 * formulario) llaman a este puerto para pedirle a la aplicación que haga
 * algo, sin conocer cómo lo hace por dentro.
 *
 * En el diagrama: esto equivale al "Adaptador de entrada API REST" que
 * recibe la petición del Frontend y dispara el caso de uso "Crear pedido".
 * Aquí, en vez de una API REST, el propio componente Angular actúa como
 * adaptador de entrada.
 * ============================================================================
 */

/** Datos mínimos que necesita el caso de uso para crear un pedido. */
export interface DatosNuevoPedido {
  cliente: string;
  producto: string;
  cantidad: number;
}

export interface CrearPedidoPort {
  ejecutar(datos: DatosNuevoPedido): Pedido;
}

export const CREAR_PEDIDO_PORT = new InjectionToken<CrearPedidoPort>('CrearPedidoPort');

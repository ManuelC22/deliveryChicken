/**
 * ============================================================================
 * CAPA DE DOMINIO (el centro del hexágono)
 * ============================================================================
 * Aquí viven las reglas y los objetos de negocio "puros": no importan nada
 * de Angular, de HTTP, ni de ninguna librería externa. Si mañana cambiamos
 * Angular por otro framework, este archivo NO debería cambiar.
 *
 * En el diagrama esto es el corazón hexagonal de "Backend Pollo Rico"
 * (aquí lo replicamos en el frontend, con fines didácticos).
 * ============================================================================
 */

import { EstadoPedido } from "./EstadoPedido";



/** Entidad de dominio: representa un pedido de Pollo Rico. */
export interface Pedido {
  id: string;
  cliente: string;
  producto: string;
  cantidad: number;
  estado: EstadoPedido;
  creadoEn: Date;
}

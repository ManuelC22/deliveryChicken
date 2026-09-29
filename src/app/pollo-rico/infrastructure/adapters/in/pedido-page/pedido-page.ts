import { Component } from '@angular/core';
import { PedidoForm } from '../pedido-form/pedido-form';
import { PedidoEstado } from '../pedido-estado/pedido-estado';

/**
 * Componente "página" que compone los dos adaptadores de entrada:
 * el formulario para crear pedidos y la lista que muestra su estado.
 * No contiene lógica de negocio, sólo organiza la pantalla.
 */
@Component({
  selector: 'app-pedido-page',
  imports: [PedidoForm, PedidoEstado],
  templateUrl: './pedido-page.html',
  styleUrl: './pedido-page.css',
})
export class PedidoPage {}

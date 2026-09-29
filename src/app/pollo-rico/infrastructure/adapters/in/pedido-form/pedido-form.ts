import { Component, Inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../../../domain/pedido.model';
import { CREAR_PEDIDO_PORT, CrearPedidoPort, DatosNuevoPedido } from '../../../../application/ports/in/crear-pedido.port';

/**
 * ============================================================================
 * ADAPTADOR DE ENTRADA: formulario para crear un pedido
 * ============================================================================
 * En el diagrama, esto equivale a los pasos 1 y 2:
 *  1. El cliente crea un pedido en el Frontend Pollo Rico.
 *  2. El Frontend llama a la API REST para crear el pedido.
 *
 * Aquí no hay una API REST intermedia: el componente Angular ES el
 * adaptador de entrada y llama DIRECTAMENTE al puerto de entrada
 * `CrearPedidoPort` (que Angular resuelve como `CrearPedidoUseCase`,
 * según lo configurado en `pollo-rico.providers.ts`).
 *
 * Fíjate que este componente NO sabe nada de cómo se guarda el pedido ni
 * de que existe una "cola de eventos": sólo conoce el puerto de entrada.
 * Esa es la regla de oro de la arquitectura hexagonal: la UI depende de
 * abstracciones (puertos), nunca de implementaciones concretas.
 * ============================================================================
 */
@Component({
  selector: 'app-pedido-form',
  imports: [FormsModule],
  templateUrl: './pedido-form.html',
  styleUrl: './pedido-form.css',
})
export class PedidoForm {
  /** Avisa al componente padre que se creó un pedido (para, por ejemplo, mostrar un mensaje). */
  readonly pedidoCreado = output<Pedido>();

  cliente = '';
  producto = '';
  cantidad = 1;

  constructor(@Inject(CREAR_PEDIDO_PORT) private readonly crearPedido: CrearPedidoPort) {}

  onSubmit(): void {
    if (!this.cliente.trim() || !this.producto.trim() || this.cantidad < 1) {
      return;
    }

    const datos: DatosNuevoPedido = {
      cliente: this.cliente.trim(),
      producto: this.producto.trim(),
      cantidad: this.cantidad,
    };

    // Aquí se cruza la frontera del hexágono: de "mundo UI" a "mundo aplicación".
    const pedido = this.crearPedido.ejecutar(datos);
    this.pedidoCreado.emit(pedido);

    this.cliente = '';
    this.producto = '';
    this.cantidad = 1;
  }
}

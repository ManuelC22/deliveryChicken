import { TestBed } from '@angular/core/testing';
import { SimuladorTeLoLlevamosAdapter } from './simulador-telollevamos.adapter';
import { PEDIDO_REPOSITORY_PORT, PedidoRepositoryPort } from '../../../application/ports/out/pedido-repository.port';
import { Pedido } from '../../../domain/pedido.model';
import { EstadoPedido } from '../../../domain/EstadoPedido';

describe('SimuladorTeLoLlevamosAdapter', () => {
  let simulador: SimuladorTeLoLlevamosAdapter;
  let repoMock: PedidoRepositoryPort;

  const pedidoMock: Pedido = {
    id: 'uuid-1',
    cliente: 'Ana',
    producto: 'Pechuga',
    cantidad: 1,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  const pedidoA: Pedido = { ...pedidoMock, id: 'uuid-a' };
  const pedidoB: Pedido = { ...pedidoMock, id: 'uuid-b' };

  beforeEach(() => {
    repoMock = {
      guardar: vi.fn(),
      buscarPorId: vi.fn(),
      actualizarEstado: vi.fn(),
      observarPedidos: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SimuladorTeLoLlevamosAdapter,
        { provide: PEDIDO_REPOSITORY_PORT, useValue: repoMock },
      ],
    });
    simulador = TestBed.inject(SimuladorTeLoLlevamosAdapter);
  });

  it('publicarPedidoCreado() no debe llamar a actualizarEstado antes de 1500 ms', () => {
    vi.useFakeTimers();
    const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
    simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoMock });
    vi.advanceTimersByTime(1499);
    expect(actualizarSpy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('debe actualizar el estado a EN_PROCESO después de 1500 ms exactos', () => {
    vi.useFakeTimers();
    const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
    simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoMock });
    vi.advanceTimersByTime(1500);
    expect(actualizarSpy).toHaveBeenCalledWith(pedidoMock.id, EstadoPedido.EN_PROCESO);
    vi.useRealTimers();
  });

  it('debe actualizar el estado a ENVIADO después de 3500 ms exactos', () => {
    vi.useFakeTimers();
    const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
    simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoMock });
    vi.advanceTimersByTime(3500);
    expect(actualizarSpy).toHaveBeenLastCalledWith(pedidoMock.id, EstadoPedido.ENVIADO);
    vi.useRealTimers();
  });

  it('debe manejar múltiples pedidos concurrentes sin mezclar sus ids', () => {
    vi.useFakeTimers();
    const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
    simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoA });
    simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoB });
    vi.advanceTimersByTime(3500);
    // 4 llamadas: 2 × EN_PROCESO + 2 × ENVIADO, cada una con su id correcto
    expect(actualizarSpy).toHaveBeenCalledTimes(4);
    vi.useRealTimers();
  });
});

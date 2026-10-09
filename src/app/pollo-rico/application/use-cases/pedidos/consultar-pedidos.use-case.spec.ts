import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConsultarPedidosUseCase } from './consultar-pedidos.use-case';
import { PEDIDO_REPOSITORY_PORT, PedidoRepositoryPort } from '../../ports/out/pedido-repository.port';
import { Pedido } from '../../../domain/pedido.model';
import { EstadoPedido } from '../../../domain/EstadoPedido';

describe('ConsultarPedidosUseCase', () => {
  let useCase: ConsultarPedidosUseCase;
  let repoMock: PedidoRepositoryPort;

  const pedidoMock: Pedido = {
    id: 'uuid-1',
    cliente: 'Test',
    producto: 'Alitas',
    cantidad: 1,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  beforeEach(() => {
    repoMock = {
      guardar: vi.fn(),
      buscarPorId: vi.fn(),
      actualizarEstado: vi.fn(),
      observarPedidos: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ConsultarPedidosUseCase,
        { provide: PEDIDO_REPOSITORY_PORT, useValue: repoMock },
      ],
    });
    useCase = TestBed.inject(ConsultarPedidosUseCase);
  });

  it('observarTodos() debe delegar a repositorioPedidos.observarPedidos()', () => {
    const mockObservable = of([pedidoMock]);
    vi.spyOn(repoMock, 'observarPedidos').mockReturnValue(mockObservable);

    const resultado = useCase.observarTodos();
    expect(resultado).toBe(mockObservable);
  });

  it('observarTodos() debe emitir los pedidos que provee el repositorio', () => {
    const pedidos = [pedidoMock];
    vi.spyOn(repoMock, 'observarPedidos').mockReturnValue(of(pedidos));

    let emitido: Pedido[] = [];
    useCase.observarTodos().subscribe(p => (emitido = p));
    expect(emitido).toEqual(pedidos);
  });
});

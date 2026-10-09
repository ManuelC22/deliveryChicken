import { TestBed } from '@angular/core/testing';
import { CrearPedidoUseCase } from './crear-pedido.use-case';
import { PEDIDO_REPOSITORY_PORT, PedidoRepositoryPort } from '../../ports/out/pedido-repository.port';
import { EVENT_PUBLISHER_PORT, EventPublisherPort } from '../../ports/out/event-publisher.port';
import { DatosNuevoPedido } from '../../ports/in/crear-pedido.port';
import { EstadoPedido } from '../../../domain/EstadoPedido';

describe('CrearPedidoUseCase', () => {
  let useCase: CrearPedidoUseCase;
  let repoMock: PedidoRepositoryPort;
  let publisherMock: EventPublisherPort;

  const datosMock: DatosNuevoPedido = {
    cliente: 'Ana Pérez',
    producto: 'Pechuga BBQ',
    cantidad: 2,
  };

  beforeEach(() => {
    repoMock = {
      guardar: vi.fn(),
      buscarPorId: vi.fn(),
      actualizarEstado: vi.fn(),
      observarPedidos: vi.fn(),
    };
    publisherMock = {
      publicarPedidoCreado: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CrearPedidoUseCase,
        { provide: PEDIDO_REPOSITORY_PORT, useValue: repoMock },
        { provide: EVENT_PUBLISHER_PORT, useValue: publisherMock },
      ],
    });
    useCase = TestBed.inject(CrearPedidoUseCase);
  });

  it('debe retornar un Pedido con los datos del input sin modificar', () => {
    const datos: DatosNuevoPedido = {
      cliente: 'Ana Pérez',
      producto: 'Pechuga BBQ',
      cantidad: 20,
    };
    const resultado = useCase.ejecutar(datos);
    expect(resultado.cliente).toBe('Ana Pérez');
    expect(resultado.producto).toBe('Pechuga BBQ');
    expect(resultado.cantidad).toBe(20);
  });

  it('debe asignar EstadoPedido.CREADO al nuevo pedido', () => {
    const resultado = useCase.ejecutar(datosMock);
    expect(resultado.estado).toBe(EstadoPedido.CREADO);
  });

  it('debe generar un id único y no vacío (crypto.randomUUID)', () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const resultado = useCase.ejecutar(datosMock);
    expect(resultado.id).toMatch(uuidRegex);
  });

  it('debe llamar a repositorioPedidos.guardar() con el pedido construido', () => {
    const guardarSpy = vi.spyOn(repoMock, 'guardar');
    const resultado = useCase.ejecutar(datosMock);
    expect(guardarSpy).toHaveBeenCalledOnce();
    expect(guardarSpy).toHaveBeenCalledWith(resultado);
  });

  it('debe llamar a publicadorEventos.publicarPedidoCreado() con tipo PedidoCreado', () => {
    const publishSpy = vi.spyOn(publisherMock, 'publicarPedidoCreado');
    const resultado = useCase.ejecutar(datosMock);
    expect(publishSpy).toHaveBeenCalledWith({
      tipo: 'PedidoCreado',
      pedido: resultado,
    });
  });
});

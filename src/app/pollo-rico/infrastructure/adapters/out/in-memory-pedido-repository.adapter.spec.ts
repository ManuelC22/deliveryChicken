import { InMemoryPedidoRepositoryAdapter } from './in-memory-pedido-repository.adapter';
import { Pedido } from '../../../domain/pedido.model';
import { EstadoPedido } from '../../../domain/EstadoPedido';

describe('InMemoryPedidoRepositoryAdapter', () => {
  let repo: InMemoryPedidoRepositoryAdapter;

  const pedidoMock: Pedido = {
    id: 'uuid-1',
    cliente: 'Ana',
    producto: 'Pechuga BBQ',
    cantidad: 2,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  const pedidoA: Pedido = {
    id: 'uuid-a',
    cliente: 'Luis',
    producto: 'Alitas',
    cantidad: 1,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  const pedidoB: Pedido = {
    id: 'uuid-b',
    cliente: 'María',
    producto: 'Pechuga',
    cantidad: 3,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  beforeEach(() => {
    repo = new InMemoryPedidoRepositoryAdapter();
  });

  it('observarPedidos() debe emitir [] al inicializar (estado vacío)', () => {
    let valor: Pedido[] = [];
    repo.observarPedidos().subscribe(p => (valor = p));
    expect(valor).toEqual([]);
  });

  it('guardar() debe agregar el pedido y emitirlo a los suscriptores', () => {
    repo.guardar(pedidoMock);
    let lista: Pedido[] = [];
    repo.observarPedidos().subscribe(p => (lista = p));
    expect(lista).toContainEqual(pedidoMock);
  });

  it('guardar() debe preservar los pedidos previos (inmutabilidad del array)', () => {
    repo.guardar(pedidoA);
    repo.guardar(pedidoB);
    let lista: Pedido[] = [];
    repo.observarPedidos().subscribe(p => (lista = p));
    expect(lista).toHaveLength(2);
    expect(lista).toContainEqual(pedidoA);
  });

  it('buscarPorId() debe retornar el pedido cuando el id existe', () => {
    repo.guardar(pedidoMock);
    const encontrado = repo.buscarPorId(pedidoMock.id);
    expect(encontrado).toEqual(pedidoMock);
  });

  it('buscarPorId() debe retornar undefined cuando el id no existe', () => {
    const encontrado = repo.buscarPorId('id-inexistente');
    expect(encontrado).toBeUndefined();
  });

  it('actualizarEstado() debe cambiar el estado solo del pedido indicado', () => {
    repo.guardar(pedidoA);
    repo.guardar(pedidoB);
    repo.actualizarEstado(pedidoA.id, EstadoPedido.EN_PROCESO);
    let lista: Pedido[] = [];
    repo.observarPedidos().subscribe(p => (lista = p));
    expect(lista.find(p => p.id === pedidoA.id)?.estado).toBe(EstadoPedido.EN_PROCESO);
    expect(lista.find(p => p.id === pedidoB.id)?.estado).toBe(EstadoPedido.CREADO);
  });

  it('actualizarEstado() debe emitir el nuevo estado a los suscriptores activos', () => {
    const emitidos: Pedido[][] = [];
    repo.guardar(pedidoMock);
    repo.observarPedidos().subscribe(p => emitidos.push(p));

    repo.actualizarEstado(pedidoMock.id, EstadoPedido.ENVIADO);
    // emitidos[0] = estado inicial tras guardar, emitidos[1] = post-actualización
    expect(emitidos[1][0].estado).toBe(EstadoPedido.ENVIADO);
  });
});

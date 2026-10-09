import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { PedidoEstado } from './pedido-estado';
import { CONSULTAR_PEDIDOS_PORT } from '../../../../application/ports/in/consultar-pedidos.port';
import { Pedido } from '../../../../domain/pedido.model';
import { EstadoPedido } from '../../../../domain/EstadoPedido';

describe('PedidoEstado', () => {
  let consultarPortMock: { observarTodos: ReturnType<typeof vi.fn> };

  const pedidoMock: Pedido = {
    id: 'uuid-1',
    cliente: 'Ana',
    producto: 'Pechuga',
    cantidad: 1,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  const pedidoA: Pedido = { ...pedidoMock, id: 'uuid-a', cliente: 'Luis' };
  const pedidoB: Pedido = { ...pedidoMock, id: 'uuid-b', cliente: 'María' };

  beforeEach(() => {
    consultarPortMock = { observarTodos: vi.fn() };
  });

  describe('lógica', () => {
    it('debe crearse correctamente con CONSULTAR_PEDIDOS_PORT inyectado', async () => {
      consultarPortMock.observarTodos.mockReturnValue(of([]));
      await TestBed.configureTestingModule({
        imports: [PedidoEstado],
        providers: [{ provide: CONSULTAR_PEDIDOS_PORT, useValue: consultarPortMock }],
      }).compileComponents();
      const fixture = TestBed.createComponent(PedidoEstado);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('pedidos$ debe ser el observable retornado por el puerto en el constructor', async () => {
      const obs$ = of([pedidoMock]);
      consultarPortMock.observarTodos.mockReturnValue(obs$);
      await TestBed.configureTestingModule({
        imports: [PedidoEstado],
        providers: [{ provide: CONSULTAR_PEDIDOS_PORT, useValue: consultarPortMock }],
      }).compileComponents();
      const fixture = TestBed.createComponent(PedidoEstado);
      expect(fixture.componentInstance.pedidos$).toBe(obs$);
    });
  });

  describe('presentación', () => {
    let fixture: ComponentFixture<PedidoEstado>;

    async function crearComponente(pedidos: Pedido[] | BehaviorSubject<Pedido[]>) {
      const obs$ = pedidos instanceof BehaviorSubject ? pedidos : of(pedidos);
      consultarPortMock.observarTodos.mockReturnValue(obs$);
      await TestBed.configureTestingModule({
        imports: [PedidoEstado],
        providers: [{ provide: CONSULTAR_PEDIDOS_PORT, useValue: consultarPortMock }],
      }).compileComponents();
      fixture = TestBed.createComponent(PedidoEstado);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    it('debe mostrar un mensaje de estado vacío cuando la lista no tiene pedidos', async () => {
      await crearComponente([]);
      expect(fixture.nativeElement.textContent).toContain('Todavía no has creado ningún pedido');
    });

    it('debe renderizar un ítem por cada pedido que emita el observable', async () => {
      await crearComponente([pedidoA, pedidoB]);
      const items = fixture.nativeElement.querySelectorAll('li.pedido');
      expect(items).toHaveLength(2);
    });

    it('debe mostrar el nombre del cliente y el estado en cada ítem', async () => {
      await crearComponente([pedidoMock]);
      const text: string = fixture.nativeElement.textContent;
      expect(text).toContain(pedidoMock.cliente);
      expect(text).toContain('CREADO');
    });

    it('debe actualizar el DOM automáticamente cuando el observable emite nuevos pedidos', async () => {
      const subject$ = new BehaviorSubject<Pedido[]>([]);
      await crearComponente(subject$);

      expect(fixture.nativeElement.textContent).toContain('Todavía no has creado ningún pedido');

      subject$.next([pedidoMock]);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain(pedidoMock.cliente);
    });
  });
});

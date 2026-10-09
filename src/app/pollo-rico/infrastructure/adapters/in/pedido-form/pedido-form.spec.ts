import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoForm } from './pedido-form';
import { CREAR_PEDIDO_PORT } from '../../../../application/ports/in/crear-pedido.port';
import { Pedido } from '../../../../domain/pedido.model';
import { EstadoPedido } from '../../../../domain/EstadoPedido';

describe('PedidoForm', () => {
  let fixture: ComponentFixture<PedidoForm>;
  let comp: PedidoForm;
  let crearPedidoMock: { ejecutar: ReturnType<typeof vi.fn> };

  const pedidoMock: Pedido = {
    id: 'uuid-1',
    cliente: 'Ana',
    producto: 'Alitas',
    cantidad: 2,
    estado: EstadoPedido.CREADO,
    creadoEn: new Date(),
  };

  beforeEach(async () => {
    crearPedidoMock = { ejecutar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PedidoForm],
      providers: [{ provide: CREAR_PEDIDO_PORT, useValue: crearPedidoMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoForm);
    comp = fixture.componentInstance;
  });

  describe('lógica', () => {
    it('debe crearse correctamente con CREAR_PEDIDO_PORT inyectado', () => {
      expect(comp).toBeTruthy();
    });

    it('onSubmit() no debe llamar al puerto si cliente está vacío', () => {
      comp.cliente = '';
      comp.producto = 'Pechuga';
      comp.cantidad = 1;
      comp.onSubmit();
      expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
    });

    it('onSubmit() no debe llamar al puerto si producto está vacío', () => {
      comp.cliente = 'Luis';
      comp.producto = '   ';
      comp.cantidad = 1;
      comp.onSubmit();
      expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
    });

    it('onSubmit() no debe llamar al puerto si cantidad es menor a 1', () => {
      comp.cliente = 'Luis';
      comp.producto = 'Alitas';
      comp.cantidad = 0;
      comp.onSubmit();
      expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
    });

    it('onSubmit() debe llamar a ejecutar() con los datos correctos (con trim)', () => {
      comp.cliente = '  Ana  ';
      comp.producto = '  Pechuga  ';
      comp.cantidad = 3;
      comp.onSubmit();
      expect(crearPedidoMock.ejecutar).toHaveBeenCalledWith({
        cliente: 'Ana',
        producto: 'Pechuga',
        cantidad: 3,
      });
    });

    it('onSubmit() debe emitir el output pedidoCreado con el pedido retornado', () => {
      crearPedidoMock.ejecutar.mockReturnValue(pedidoMock);
      let emitido: Pedido | undefined;
      comp.pedidoCreado.subscribe(p => (emitido = p));

      comp.cliente = 'Ana';
      comp.producto = 'Alitas';
      comp.cantidad = 2;
      comp.onSubmit();
      expect(emitido).toEqual(pedidoMock);
    });

    it('onSubmit() debe resetear los campos del formulario tras el submit exitoso', () => {
      crearPedidoMock.ejecutar.mockReturnValue(pedidoMock);
      comp.cliente = 'Ana';
      comp.producto = 'Alitas';
      comp.cantidad = 2;
      comp.onSubmit();
      expect(comp.cliente).toBe('');
      expect(comp.producto).toBe('');
      expect(comp.cantidad).toBe(1);
    });
  });

  describe('presentación', () => {
    it('debe renderizar los tres campos del formulario (cliente, producto, cantidad)', () => {
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('input[name="cliente"]')).toBeTruthy();
      expect(el.querySelector('input[name="producto"]')).toBeTruthy();
      expect(el.querySelector('input[type="number"]')).toBeTruthy();
    });

    it('el campo cantidad debe tener valor inicial de 1', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;
      expect(input.value).toBe('1');
    });

    it('debe renderizar un botón de submit visible', () => {
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(btn).toBeTruthy();
      expect(btn.textContent?.trim()).not.toBe('');
    });

    it('al hacer click en submit con campos vacíos, el DOM no debe cambiar', () => {
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      btn.click();
      fixture.detectChanges();
      expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
    });

    it('los campos deben vaciarse visualmente tras un submit exitoso', async () => {
      crearPedidoMock.ejecutar.mockReturnValue(pedidoMock);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const clienteInput = el.querySelector('input[name="cliente"]') as HTMLInputElement;
      const productoInput = el.querySelector('input[name="producto"]') as HTMLInputElement;
      const cantidadInput = el.querySelector('input[type="number"]') as HTMLInputElement;

      clienteInput.value = 'María';
      clienteInput.dispatchEvent(new Event('input'));
      productoInput.value = 'Alitas';
      productoInput.dispatchEvent(new Event('input'));
      cantidadInput.value = '2';
      cantidadInput.dispatchEvent(new Event('input'));

      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(clienteInput.value).toBe('');
    });
  });
});

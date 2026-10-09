import { TestBed } from '@angular/core/testing';
import { PedidoPage } from './pedido-page';
import { POLLO_RICO_PROVIDERS } from '../../../../pollo-rico.providers';

describe('PedidoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoPage],
      providers: POLLO_RICO_PROVIDERS,
    }).compileComponents();
  });

  describe('smoke test', () => {
    it('debe crearse correctamente con todos los providers de la ruta', () => {
      const fixture = TestBed.createComponent(PedidoPage);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('no debe tener lógica propia: cero propiedades y cero métodos propios', () => {
      const fixture = TestBed.createComponent(PedidoPage);
      const comp = fixture.componentInstance;
      const ownKeys = Object.getOwnPropertyNames(comp).filter(k => !k.startsWith('__ng'));
      expect(ownKeys).toHaveLength(0);
    });
  });

  describe('presentación', () => {
    it('debe renderizar el componente app-pedido-form en el template', () => {
      const fixture = TestBed.createComponent(PedidoPage);
      fixture.detectChanges();
      const form = fixture.nativeElement.querySelector('app-pedido-form');
      expect(form).toBeTruthy();
    });

    it('debe renderizar el componente app-pedido-estado en el template', () => {
      const fixture = TestBed.createComponent(PedidoPage);
      fixture.detectChanges();
      const estado = fixture.nativeElement.querySelector('app-pedido-estado');
      expect(estado).toBeTruthy();
    });
  });
});

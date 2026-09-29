import { Routes } from '@angular/router';
import { POLLO_RICO_PROVIDERS } from './pollo-rico/pollo-rico.providers';

export const routes: Routes = [
  {
    path: 'pollo-rico',
    // Los `providers` a nivel de ruta hacen que los adaptadores de
    // Pollo Rico (repositorio, publicador de eventos, casos de uso) sólo
    // existan mientras el usuario está dentro de esta sección de la app.
    // Así se ve claramente el "módulo hexagonal" como una unidad aislada.
    providers: POLLO_RICO_PROVIDERS,
    loadComponent: () =>
      import('./pollo-rico/infrastructure/adapters/in/pedido-page/pedido-page').then((m) => m.PedidoPage),
  },
  { path: '', redirectTo: 'pollo-rico', pathMatch: 'full' },
];

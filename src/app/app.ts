import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Shell raíz de la aplicación. Sólo aloja el `router-outlet`: la pantalla
 * real (con la arquitectura hexagonal de Pollo Rico) vive en las rutas,
 * ver `app.routes.ts`.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

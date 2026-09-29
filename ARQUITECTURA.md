# Arquitectura Hexagonal — Frontend Pollo Rico

Esta plantilla implementa, dentro del Angular de `deliveryChicken`, la parte de
**"Frontend Pollo Rico"** del diagrama (`diagrama.png`), aplicando **arquitectura
hexagonal (puertos y adaptadores)** al propio frontend.

> **Alcance de esta plantilla:** sólo frontend. No hay backend real ni cola de
> mensajería: el "Backend TeLoLlevamos" y la "BD Pollo Rico" del diagrama se
> **simulan** con un adaptador en memoria, para que puedas ver el flujo
> completo sin levantar ningún servidor.

## ¿Por qué arquitectura hexagonal en un frontend?

Normalmente la arquitectura hexagonal se explica para backends, pero la idea
central — separar **qué hace la app** (negocio) de **cómo lo hace
técnicamente** (infraestructura: HTTP, almacenamiento, Angular mismo) —
también sirve para un frontend. Ventajas prácticas:

- Puedes probar los casos de uso sin levantar Angular ni el navegador.
- Puedes cambiar de "datos simulados en memoria" a "API REST real" cambiando
  **una sola línea** (ver `pollo-rico.providers.ts`), sin tocar componentes.
- Los componentes de UI quedan simples: sólo capturan datos y muestran
  resultados, no contienen reglas de negocio.

## Estructura de carpetas

```
src/app/pollo-rico/
├── domain/                          # Entidades de negocio puras (sin Angular)
│   └── pedido.model.ts
├── application/                     # El hexágono: casos de uso + puertos
│   ├── ports/
│   │   ├── in/                      # Puertos de ENTRADA (lo que la app ofrece)
│   │   │   ├── crear-pedido.port.ts
│   │   │   └── consultar-pedidos.port.ts
│   │   └── out/                     # Puertos de SALIDA (lo que la app necesita)
│   │       ├── pedido-repository.port.ts
│   │       └── event-publisher.port.ts
│   └── use-cases/                   # Implementan los puertos de entrada
│       ├── crear-pedido.use-case.ts
│       └── consultar-pedidos.use-case.ts
├── infrastructure/
│   └── adapters/
│       ├── in/                      # Adaptadores de ENTRADA = componentes Angular
│       │   ├── pedido-form/         # Crea un pedido (pasos 1-2 del diagrama)
│       │   ├── pedido-estado/       # Muestra el estado (paso 8 del diagrama)
│       │   └── pedido-page/         # Compone los dos anteriores
│       └── out/                     # Adaptadores de SALIDA = implementan los puertos "out"
│           ├── in-memory-pedido-repository.adapter.ts   # simula la "BD Pollo Rico"
│           └── simulador-telollevamos.adapter.ts        # simula la cola + "Backend TeLoLlevamos"
└── pollo-rico.providers.ts          # <-- EL WIRING: conecta puertos con adaptadores
```

## Cómo leer el flujo (comparado con el diagrama)

| Paso diagrama | En esta plantilla |
|---|---|
| 1. Cliente crea pedido | El usuario llena `PedidoForm` |
| 2. Llama a API REST | `PedidoForm` invoca el puerto `CREAR_PEDIDO_PORT` (sin HTTP real) |
| 3. Crear pedido / publicar evento | `CrearPedidoUseCase` guarda el pedido (`PEDIDO_REPOSITORY_PORT`) y publica el evento (`EVENT_PUBLISHER_PORT`) |
| 4. Evento a TeLoLlevamos | `SimuladorTeLoLlevamosAdapter` "recibe" el evento (simulado) |
| 5-6. Procesar entrega / actualizar estado | El simulador cambia el estado a `EN_PROCESO` y luego a `ENVIADO` con `setTimeout` |
| 7. Backend Pollo Rico actualiza pedido | El simulador llama de vuelta a `PedidoRepositoryPort.actualizarEstado()` |
| 8. Frontend muestra estado actualizado | `PedidoEstado` se suscribe al observable reactivo y se refresca sola |

## Regla de oro para modificar este proyecto

- Si necesitas **cambiar una regla de negocio** → tócala en `application/use-cases/`.
- Si necesitas **conectar a un backend real** → crea un nuevo adaptador en
  `infrastructure/adapters/out/` (p.ej. `HttpPedidoRepositoryAdapter` usando
  `HttpClient`) y cámbialo en `pollo-rico.providers.ts`. Los casos de uso y
  los componentes NO deberían necesitar cambios.
- Si necesitas **cambiar la UI** → tócala en `infrastructure/adapters/in/`,
  siempre hablando con la aplicación a través de los puertos de entrada
  (`CREAR_PEDIDO_PORT`, `CONSULTAR_PEDIDOS_PORT`), nunca accediendo
  directamente al repositorio.

## Probarlo

```bash
npm install
ng serve
```

Abre `http://localhost:4200`, crea un pedido y observa cómo su estado pasa
de `CREADO` → `EN_PROCESO` → `ENVIADO` solo (revisa también la consola del
navegador para ver los "eventos" simulados).

Angular + Vitest

# Plan de Pruebas Unitarias — deliveryChicken

ProyectoHexagonal · 29 escenarios

Pruebas de Servicios

[CrearPedidoUseCase 5](#crear-pedido-use-case) [ConsultarPedidosUseCase 2](#consultar-pedidos-use-case) [InMemoryPedidoRepository 7](#in-memory-repository) [SimuladorTeLoLlevamos 4](#simulador-adapter)

Pruebas de Componentes

[PedidoForm (lógica) 7](#pedido-form-comp) [PedidoEstado (lógica) 2](#pedido-estado-comp) [PedidoPage (smoke) 2](#pedido-page-comp)

Pruebas de Presentación

[PedidoForm (DOM) 5](#pedido-form-pres) [PedidoEstado (DOM) 4](#pedido-estado-pres) [PedidoPage (DOM) 2](#pedido-page-pres)

18

Servicios · 4 archivos

11

Componentes · 3 archivos

11

Presentación · 3 archivos

29

Escenarios totales

Pruebas de Servicios

Service

⚙️

Caso de Uso

CrearPedidoUseCase

crear-pedido.use-case.spec.ts

Service

✓ debe retornar un Pedido con los datos del input sin modificar ▶

**Qué valida:** que el caso de uso mapea correctamente `DatosNuevoPedido` al objeto `Pedido` retornado.

**Mock:** Spy en `repositorioPedidos.guardar` y `publicadorEventos.publicarPedidoCreado`.

```
// Arrange
const datos: DatosNuevoPedido = {
  cliente: 'Ana Pérez',
  producto: 'Pechuga BBQ',
  cantidad: 2
};
// Act
const resultado = useCase.ejecutar(datos);
// Assert
expect(resultado.cliente).toBe('Ana Pérez');
expect(resultado.producto).toBe('Pechuga BBQ');
expect(resultado.cantidad).toBe(2);
```

✓ debe asignar EstadoPedido.CREADO al nuevo pedido ▶

**Qué valida:** que el estado inicial siempre es `CREADO` independientemente de la entrada.

```
const resultado = useCase.ejecutar(datosMock);
expect(resultado.estado).toBe(EstadoPedido.CREADO);
```

✓ debe generar un id único y no vacío (crypto.randomUUID) ▶

**Qué valida:** que el `id` es un string no vacío (formato UUID). Con Vitest se puede espiarlo o simplemente verificar el patrón.

```
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const resultado = useCase.ejecutar(datosMock);
expect(resultado.id).toMatch(uuidRegex);
```

✓ debe llamar a repositorioPedidos.guardar() con el pedido construido ▶

**Qué valida:** que el caso de uso persiste el pedido invocando el puerto de salida exactamente una vez.

```
const guardarSpy = vi.spyOn(repoMock, 'guardar');
const resultado = useCase.ejecutar(datosMock);
expect(guardarSpy).toHaveBeenCalledOnce();
expect(guardarSpy).toHaveBeenCalledWith(resultado);
```

✓ debe llamar a publicadorEventos.publicarPedidoCreado() con tipo 'PedidoCreado' ▶

**Qué valida:** que el evento de dominio se publica con la estructura correcta.

```
const publishSpy = vi.spyOn(publisherMock, 'publicarPedidoCreado');
const resultado = useCase.ejecutar(datosMock);
expect(publishSpy).toHaveBeenCalledWith({
  tipo: 'PedidoCreado',
  pedido: resultado
});
```

⚙️

Caso de Uso

ConsultarPedidosUseCase

consultar-pedidos.use-case.spec.ts

Service

✓ observarTodos() debe delegar a repositorioPedidos.observarPedidos() ▶

**Qué valida:** que el caso de uso no introduce lógica propia; simplemente reenvía el observable del repositorio.

```
const mockObservable = of([pedidoMock]);
vi.spyOn(repoMock, 'observarPedidos').mockReturnValue(mockObservable);

const resultado = useCase.observarTodos();
expect(resultado).toBe(mockObservable); // misma referencia
```

✓ observarTodos() debe emitir los pedidos que provee el repositorio ▶

**Qué valida:** verificación de extremo a extremo dentro de la capa de aplicación, suscribiendo al observable.

```
const pedidos = [pedidoMock];
vi.spyOn(repoMock, 'observarPedidos').mockReturnValue(of(pedidos));

let emitido: Pedido[];
useCase.observarTodos().subscribe(p => emitido = p);
expect(emitido).toEqual(pedidos);
```

🗄️

Adaptador de Salida

InMemoryPedidoRepositoryAdapter

in-memory-pedido-repository.adapter.spec.ts

Service

✓ observarPedidos() debe emitir \[\] al inicializar (estado vacío) ▶

**Qué valida:** el valor inicial del `BehaviorSubject`.

```
let valor: Pedido[];
repo.observarPedidos().subscribe(p => valor = p);
expect(valor).toEqual([]);
```

✓ guardar() debe agregar el pedido y emitirlo a los suscriptores ▶

**Qué valida:** que tras `guardar()` el observable emite el nuevo pedido.

```
repo.guardar(pedidoMock);
let lista: Pedido[];
repo.observarPedidos().subscribe(p => lista = p);
expect(lista).toContainEqual(pedidoMock);
```

✓ guardar() debe preservar los pedidos previos (inmutabilidad del array) ▶

**Qué valida:** que el spread `[...prev, nuevo]` no pierde los anteriores.

```
repo.guardar(pedidoA);
repo.guardar(pedidoB);
let lista: Pedido[];
repo.observarPedidos().subscribe(p => lista = p);
expect(lista).toHaveLength(2);
expect(lista).toContainEqual(pedidoA);
```

✓ buscarPorId() debe retornar el pedido cuando el id existe ▶

```
repo.guardar(pedidoMock);
const encontrado = repo.buscarPorId(pedidoMock.id);
expect(encontrado).toEqual(pedidoMock);
```

✓ buscarPorId() debe retornar undefined cuando el id no existe ▶

```
const encontrado = repo.buscarPorId('id-inexistente');
expect(encontrado).toBeUndefined();
```

✓ actualizarEstado() debe cambiar el estado solo del pedido indicado ▶

**Qué valida:** que los demás pedidos no se ven afectados por la actualización.

```
repo.guardar(pedidoA); // estado: CREADO
repo.guardar(pedidoB); // estado: CREADO
repo.actualizarEstado(pedidoA.id, EstadoPedido.EN_PROCESO);
let lista: Pedido[];
repo.observarPedidos().subscribe(p => lista = p);
expect(lista.find(p => p.id === pedidoA.id)?.estado).toBe(EstadoPedido.EN_PROCESO);
expect(lista.find(p => p.id === pedidoB.id)?.estado).toBe(EstadoPedido.CREADO);
```

✓ actualizarEstado() debe emitir el nuevo estado a los suscriptores activos ▶

**Qué valida:** la reactividad del `BehaviorSubject`: un suscriptor ya conectado recibe el cambio.

```
const emitidos: Pedido[][] = [];
repo.guardar(pedidoMock);
repo.observarPedidos().subscribe(p => emitidos.push(p));

repo.actualizarEstado(pedidoMock.id, EstadoPedido.ENVIADO);
// emitidos[0] = estado inicial, emitidos[1] = post-actualización
expect(emitidos[1][0].estado).toBe(EstadoPedido.ENVIADO);
```

⏱️

Adaptador de Salida

SimuladorTeLoLlevamosAdapter

simulador-telollevamos.adapter.spec.ts

Service

✓ publicarPedidoCreado() no debe llamar a actualizarEstado antes de 1500 ms ▶

**Qué valida:** que ningún timer se dispara antes del retardo configurado. Usa `vi.useFakeTimers()`.

```
vi.useFakeTimers();
const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoMock });
vi.advanceTimersByTime(1499);
expect(actualizarSpy).not.toHaveBeenCalled();
vi.useRealTimers();
```

✓ debe actualizar el estado a EN_PROCESO después de 1500 ms exactos ▶

```
vi.useFakeTimers();
const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoMock });
vi.advanceTimersByTime(1500);
expect(actualizarSpy).toHaveBeenCalledWith(pedidoMock.id, EstadoPedido.EN_PROCESO);
vi.useRealTimers();
```

✓ debe actualizar el estado a ENVIADO después de 3500 ms exactos ▶

```
vi.useFakeTimers();
const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoMock });
vi.advanceTimersByTime(3500);
expect(actualizarSpy).toHaveBeenLastCalledWith(pedidoMock.id, EstadoPedido.ENVIADO);
vi.useRealTimers();
```

✓ debe manejar múltiples pedidos concurrentes sin mezclar sus ids ▶

**Qué valida:** que los closures de los `setTimeout` capturan el `id` correcto por pedido.

```
vi.useFakeTimers();
const actualizarSpy = vi.spyOn(repoMock, 'actualizarEstado');
simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoA });
simulador.publicarPedidoCreado({ tipo: 'PedidoCreado', pedido: pedidoB });
vi.advanceTimersByTime(3500);
// 4 llamadas: 2 × EN_PROCESO + 2 × ENVIADO, cada una con su id
expect(actualizarSpy).toHaveBeenCalledTimes(4);
vi.useRealTimers();
```

Pruebas de Componentes

Component

📋

Adaptador de Entrada

PedidoForm — lógica del componente

pedido-form.spec.ts · bloque describe('lógica')

Component

✓ debe crearse correctamente con CREAR_PEDIDO_PORT inyectado ▶

**Configuración TestBed:** proveer un mock de `CREAR_PEDIDO_PORT`.

```
await TestBed.configureTestingModule({
  imports: [PedidoForm],
  providers: [{
    provide: CREAR_PEDIDO_PORT,
    useValue: { ejecutar: vi.fn() }
  }]
}).compileComponents();
const fixture = TestBed.createComponent(PedidoForm);
expect(fixture.componentInstance).toBeTruthy();
```

✓ onSubmit() no debe llamar al puerto si cliente está vacío ▶

```
comp.cliente = '';
comp.producto = 'Pechuga';
comp.cantidad = 1;
comp.onSubmit();
expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
```

✓ onSubmit() no debe llamar al puerto si producto está vacío ▶

```
comp.cliente = 'Luis';
comp.producto = '   '; // solo espacios — trim() → ''
comp.cantidad = 1;
comp.onSubmit();
expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
```

✓ onSubmit() no debe llamar al puerto si cantidad es menor a 1 ▶

```
comp.cliente = 'Luis';
comp.producto = 'Alitas';
comp.cantidad = 0;
comp.onSubmit();
expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
```

✓ onSubmit() debe llamar a ejecutar() con los datos correctos (con trim) ▶

**Qué valida:** que los espacios al inicio/fin se eliminan antes de llamar al puerto.

```
comp.cliente = '  Ana  ';
comp.producto = '  Pechuga  ';
comp.cantidad = 3;
comp.onSubmit();
expect(crearPedidoMock.ejecutar).toHaveBeenCalledWith({
  cliente:  'Ana',
  producto: 'Pechuga',
  cantidad: 3
});
```

✓ onSubmit() debe emitir el output pedidoCreado con el pedido retornado ▶

```
crearPedidoMock.ejecutar.mockReturnValue(pedidoMock);
let emitido: Pedido | undefined;
comp.pedidoCreado.subscribe(p => emitido = p);

comp.cliente = 'Ana'; comp.producto = 'Alitas'; comp.cantidad = 2;
comp.onSubmit();
expect(emitido).toEqual(pedidoMock);
```

✓ onSubmit() debe resetear los campos del formulario tras el submit exitoso ▶

```
comp.cliente = 'Ana'; comp.producto = 'Alitas'; comp.cantidad = 2;
comp.onSubmit();
expect(comp.cliente).toBe('');
expect(comp.producto).toBe('');
expect(comp.cantidad).toBe(1);
```

📜

Adaptador de Entrada

PedidoEstado — lógica del componente

pedido-estado.spec.ts · bloque describe('lógica')

Component

✓ debe crearse correctamente con CONSULTAR_PEDIDOS_PORT inyectado ▶

```
await TestBed.configureTestingModule({
  imports: [PedidoEstado],
  providers: [{
    provide: CONSULTAR_PEDIDOS_PORT,
    useValue: { observarTodos: vi.fn().mockReturnValue(of([])) }
  }]
}).compileComponents();
const fixture = TestBed.createComponent(PedidoEstado);
expect(fixture.componentInstance).toBeTruthy();
```

✓ pedidos$ debe ser el observable retornado por el puerto en el constructor ▶

**Qué valida:** que `pedidos$` es exactamente la referencia que entrega `observarTodos()`.

```
const obs$ = of([pedidoMock]);
consultarPortMock.observarTodos.mockReturnValue(obs$);
fixture = TestBed.createComponent(PedidoEstado);
expect(fixture.componentInstance.pedidos$).toBe(obs$);
```

🏠

Página Shell

PedidoPage — smoke test

pedido-page.spec.ts

Component

✓ debe crearse correctamente con todos los providers de la ruta ▶

**Nota:** proveer todos los tokens de la ruta (o importar `POLLO_RICO_PROVIDERS`) para que sus hijos resuelvan sus dependencias.

```
await TestBed.configureTestingModule({
  imports: [PedidoPage],
  providers: POLLO_RICO_PROVIDERS // wiring real o mocks de todos los puertos
}).compileComponents();
const fixture = TestBed.createComponent(PedidoPage);
expect(fixture.componentInstance).toBeTruthy();
```

✓ no debe tener lógica propia: cero propiedades y cero métodos propios ▶

**Qué valida:** que `PedidoPage` es un componente shell puro sin estado ni comportamiento propios.

```
const comp = fixture.componentInstance;
// Solo debe tener los miembros heredados de Angular
const ownKeys = Object.getOwnPropertyNames(comp);
expect(ownKeys).toHaveLength(0);
```

Pruebas de Presentación

Presentation

🖥️

Template / DOM

PedidoForm — renderizado

pedido-form.spec.ts · bloque describe('presentación')

Presentation

✓ debe renderizar los tres campos del formulario (cliente, producto, cantidad) ▶

```
const el: HTMLElement = fixture.nativeElement;
expect(el.querySelector('input[name="cliente"]')).toBeTruthy();
expect(el.querySelector('input[name="producto"]')).toBeTruthy();
expect(el.querySelector('input[type="number"]')).toBeTruthy();
```

✓ el campo cantidad debe tener valor inicial de 1 ▶

```
fixture.detectChanges();
const input = fixture.nativeElement.querySelector('input[type="number"]');
expect(input.value).toBe('1');
```

✓ debe renderizar un botón de submit visible ▶

```
const btn = fixture.nativeElement.querySelector('button[type="submit"]');
expect(btn).toBeTruthy();
expect(btn.textContent.trim())..not.toBe('');
```

✓ al hacer click en submit con campos vacíos, el DOM no debe cambiar ▶

**Qué valida:** que la validación de la UI funciona: sin datos válidos, no hay ningún efecto visible.

```
fixture.detectChanges();
const btn = fixture.nativeElement.querySelector('button[type="submit"]');
btn.click();
fixture.detectChanges();
expect(crearPedidoMock.ejecutar).not.toHaveBeenCalled();
```

✓ los campos deben vaciarse visualmente tras un submit exitoso ▶

**Qué valida:** que el binding de NgModel refleja el reset de las propiedades en el DOM.

```
crearPedidoMock.ejecutar.mockReturnValue(pedidoMock);
fixture.detectChanges();
// Rellenar campos mediante el DOM
const clienteInput = el.querySelector('input[name="cliente"]');
clienteInput.value = 'María';
clienteInput.dispatchEvent(new Event('input'));
// idem para producto y cantidad…
el.querySelector('form').dispatchEvent(new Event('submit'));
fixture.detectChanges();
expect(clienteInput.value).toBe('');
```

🖥️

Template / DOM

PedidoEstado — renderizado

pedido-estado.spec.ts · bloque describe('presentación')

Presentation

✓ debe mostrar un mensaje de estado vacío cuando la lista no tiene pedidos ▶

**Qué valida:** el empty state del template, visible cuando el observable emite `[]`.

```
consultarPortMock.observarTodos.mockReturnValue(of([]));
fixture = TestBed.createComponent(PedidoEstado);
fixture.detectChanges();
const el: HTMLElement = fixture.nativeElement;
// Ajustar el selector al elemento real del empty state en el template
expect(el.textContent).toContain('No hay pedidos');
```

✓ debe renderizar un ítem por cada pedido que emita el observable ▶

```
consultarPortMock.observarTodos.mockReturnValue(of([pedidoA, pedidoB]));
fixture = TestBed.createComponent(PedidoEstado);
fixture.detectChanges();
const items = fixture.nativeElement.querySelectorAll('[data-testid="pedido-item"]');
expect(items).toHaveLength(2);
```

✓ debe mostrar el nombre del cliente y el estado en cada ítem ▶

```
consultarPortMock.observarTodos.mockReturnValue(of([pedidoMock]));
fixture = TestBed.createComponent(PedidoEstado);
fixture.detectChanges();
const text = fixture.nativeElement.textContent;
expect(text).toContain(pedidoMock.cliente);
expect(text).toContain('CREADO');
```

✓ debe actualizar el DOM automáticamente cuando el observable emite nuevos pedidos ▶

**Qué valida:** que `AsyncPipe` reacciona a un nuevo valor emitido por el `Subject`.

```
const subject$ = new BehaviorSubject<Pedido[]>([]);
consultarPortMock.observarTodos.mockReturnValue(subject$);
fixture = TestBed.createComponent(PedidoEstado);
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('No hay pedidos');

subject$.next([pedidoMock]);
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain(pedidoMock.cliente);
```

🖥️

Template / DOM

PedidoPage — renderizado

pedido-page.spec.ts · bloque describe('presentación')

Presentation

✓ debe renderizar el componente app-pedido-form en el template ▶

```
fixture.detectChanges();
const form = fixture.nativeElement.querySelector('app-pedido-form');
expect(form).toBeTruthy();
```

✓ debe renderizar el componente app-pedido-estado en el template ▶

```
fixture.detectChanges();
const estado = fixture.nativeElement.querySelector('app-pedido-estado');
expect(estado).toBeTruthy();
```
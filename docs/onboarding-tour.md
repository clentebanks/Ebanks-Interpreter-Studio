# Tour guiado de primera visita

## Objetivo

El tour guiado ayuda a los usuarios que entran por primera vez a **Ebanks Interpreter Studio** a comprender las funciones principales sin abandonar la página ni leer un manual externo.

El componente presenta una secuencia de pasos con:

- oscurecimiento del resto de la interfaz;
- resaltado del elemento explicado;
- título y descripción de cada función;
- indicador `Paso X de Y`;
- barra de progreso;
- botones **Anterior**, **Siguiente**, **Omitir guía** y **Finalizar**;
- cierre con la tecla `Esc`;
- navegación con las flechas izquierda y derecha;
- adaptación para computadora, tableta y teléfono;
- botón permanente **Guía** para repetir el recorrido.

## Archivos

```text
index.html
css/onboarding.css
js/onboarding.js
scripts/validate-onboarding.js
docs/onboarding-tour.md
```

### `index.html`

Contiene el botón que vuelve a abrir el recorrido y carga los archivos CSS y JavaScript del componente.

### `css/onboarding.css`

Define el botón de ayuda, la capa oscura, el resaltado, el cuadro informativo, los controles y el comportamiento adaptable.

### `js/onboarding.js`

Contiene:

- la lista de pasos;
- la lógica de primera visita;
- el posicionamiento del resaltado y del cuadro;
- la navegación por teclado;
- el guardado del estado;
- eventos opcionales de Google Analytics.

### `scripts/validate-onboarding.js`

Comprueba que los archivos del componente existan, que estén enlazados desde `index.html` y que el recorrido conserve sus selectores principales.

## Pasos actuales

1. Bienvenida y propósito general.
2. Navegación principal.
3. Búsqueda bilingüe.
4. Filtros por categorías.
5. Lista de resultados.
6. Ficha terminológica y guardado.
7. Escenarios profesionales.
8. Recursos externos.
9. Práctica con tarjetas.
10. Botón para repetir la guía.

## Comportamiento de primera visita

El estado se guarda en `localStorage` con esta clave:

```text
eis-onboarding:1.0.0
```

La guía se abre automáticamente cuando la clave no existe. Al finalizarla u omitirla se guarda un registro local y no vuelve a aparecer de forma automática en ese navegador.

El usuario siempre puede repetirla mediante el botón **Guía**.

## Reiniciar manualmente durante pruebas

En las herramientas de desarrollo del navegador, ejecuta:

```javascript
localStorage.removeItem("eis-onboarding:1.0.0");
location.reload();
```

También puedes abrirla directamente con el botón **Guía**, sin borrar el almacenamiento.

## Publicar una nueva versión del recorrido

Cuando los pasos cambien de manera importante, modifica en `js/onboarding.js`:

```javascript
const TOUR_VERSION = "1.0.0";
```

Por ejemplo:

```javascript
const TOUR_VERSION = "1.1.0";
```

Una versión nueva genera otra clave de `localStorage`, por lo que el recorrido actualizado se mostrará una vez a todos los usuarios.

No cambies la versión por correcciones pequeñas de texto o estilos, porque eso volvería a mostrar la guía innecesariamente.

## Editar los pasos

Los pasos se encuentran en el arreglo `steps` de `js/onboarding.js`.

Ejemplo:

```javascript
{
  target: "#search-form",
  label: "Búsqueda bilingüe",
  title: "Busca en inglés, español o por abreviatura",
  description: "Explicación breve y directa.",
  tip: "Consejo opcional."
}
```

### Campo `target`

Debe contener un selector CSS válido que identifique un elemento existente y estable de la interfaz.

Usa `target: null` cuando el paso deba aparecer centrado sin resaltar una sección específica.

### Reglas editoriales

- explicar una sola acción por paso;
- utilizar lenguaje directo;
- evitar párrafos largos;
- no prometer funciones que el sitio no ofrece;
- recordar la privacidad cuando corresponda;
- mantener el recorrido entre 6 y 12 pasos.

## Accesibilidad

El componente incluye:

- `role="dialog"` y `aria-modal="true"`;
- asociación entre título, descripción y diálogo;
- región `aria-live` para anunciar cada paso;
- foco dentro del cuadro mientras el recorrido está abierto;
- cierre con `Esc`;
- navegación con teclado;
- respeto por `prefers-reduced-motion`.

## Analítica

Cuando Google Analytics está disponible, el componente envía estos eventos:

```text
onboarding_start
onboarding_restart
onboarding_completed
onboarding_skipped
```

Incluyen la versión, el paso actual y el total de pasos. Si `gtag` no está disponible, el recorrido funciona normalmente y no produce errores.

## Validación

Ejecuta:

```bash
npm run validate:onboarding
```

Resultado esperado:

```text
Tour guiado validado correctamente.
Archivos, enlaces y selectores principales presentes.
```

## Lista de comprobación manual

1. Abre el sitio en una ventana privada.
2. Confirma que la guía aparece una sola vez.
3. Recorre todos los pasos con **Siguiente**.
4. Regresa con **Anterior**.
5. Comprueba el cierre con **Omitir guía** y `Esc`.
6. Abre nuevamente el recorrido con **Guía**.
7. Repite la prueba en una pantalla móvil.
8. Confirma que búsqueda, categorías, práctica, escenarios y listas siguen funcionando después del recorrido.

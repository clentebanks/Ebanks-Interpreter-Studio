# Ebanks Interpreter Studio

Plataforma bilingüe de terminología, consulta rápida y práctica para intérpretes profesionales de inglés y español.

**Ebanks Interpreter Studio** está diseñado para ayudar a intérpretes OPI a localizar términos, abreviaturas y equivalencias con rapidez durante su preparación y consulta profesional. La terminología médica continúa como núcleo principal y ahora se complementa con seguros, trámites, pagos, servicios públicos y comunicación OPI.

> **El término correcto, justo cuando lo necesitas.**

## Funciones

- Búsqueda bidireccional en inglés y español.
- Consulta de términos y abreviaturas médicas y administrativas.
- Filtros por categorías.
- Fichas terminológicas con definición y contexto.
- Pronunciación escrita para términos en inglés.
- Advertencias sobre falsos cognados y errores frecuentes.
- Favoritos guardados en el navegador.
- Lista personal de términos.
- Tarjetas interactivas de práctica.
- Diseño adaptable a computadoras, tabletas y teléfonos.
- Tour guiado para usuarios que entran por primera vez.
- Botón **Guía** para repetir el recorrido cuando sea necesario.

## Tecnologías

- HTML5
- Bootstrap 5
- CSS3
- JavaScript puro
- LocalStorage

El proyecto no necesita compilación, servidor, base de datos ni instalación de dependencias para funcionar en su versión actual.

## Estructura

```text
ebanks-interpreter-studio/
├── index.html
├── site.webmanifest
├── assets/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── logo.png
├── css/
│   ├── styles.css
│   └── onboarding.css
├── data/
│   ├── terms.csv
│   ├── terms.json
│   ├── most-common-prescribed-medications-source.csv
│   ├── medical-verbs-source.csv
│   ├── import-prescribed-medications-report.json
│   └── import-medical-verbs-report.json
├── docs/
│   ├── onboarding-tour.md
│   ├── plantilla-terminologia-ebanks-interpreter-studio.xlsx
│   └── sources/
│       └── most-common-prescribed-medications.pdf
├── js/
│   ├── app.js
│   ├── data.js
│   ├── onboarding.js
│   └── scenarios-data.js
├── scripts/
│   ├── generate-terms.js
│   └── validate-onboarding.js
├── CHANGELOG.md
├── package.json
└── README.md
```

## Cómo utilizarlo

1. Descarga o clona el repositorio.
2. Abre `index.html` en un navegador moderno.
3. Utiliza el buscador para consultar términos en inglés, español o por abreviatura.

También puedes publicar la carpeta directamente en Netlify, GitHub Pages u otro servicio de alojamiento estático.


## Tour guiado para nuevos usuarios

La versión **1.6.0** incorpora un recorrido interactivo que explica las funciones principales durante la primera visita. Incluye diez pasos para presentar navegación, búsqueda, categorías, resultados, fichas, escenarios, recursos, práctica y listas.

El recorrido:

- se muestra automáticamente una sola vez por navegador;
- puede omitirse o cerrarse con `Esc`;
- permite avanzar y retroceder;
- se adapta a pantallas móviles;
- puede repetirse con el botón **Guía**;
- no modifica búsquedas, favoritos ni términos;
- guarda únicamente su estado local mediante `localStorage`.

La documentación completa se encuentra en:

```text
docs/onboarding-tour.md
```

Para validar su integración ejecuta:

```bash
npm run validate:onboarding
```

Para simular nuevamente una primera visita durante desarrollo:

```javascript
localStorage.removeItem("eis-onboarding:1.0.0");
location.reload();
```

## Sistema para agregar términos

La fuente principal es:

```text
data/terms.csv
```

Puedes editarla con Excel o Google Sheets. También tienes una plantilla profesional en:

```text
docs/plantilla-terminologia-ebanks-interpreter-studio.xlsx
```

Cuando termines de editar el CSV, ejecuta:

```bash
npm run terms
```

También puedes utilizar `npm run generate`; ambos comandos validan el archivo maestro y regeneran los archivos que consume el sitio.

El sistema revisa campos obligatorios, identificadores y términos duplicados, estados de revisión, fuentes y fechas. Si todo está correcto, genera automáticamente:

```text
data/terms.json
js/data.js
```

No edites esos dos archivos manualmente.

Cada registro generado utiliza una estructura similar a esta:

```javascript
{
  id: 1,
  en: "Shortness of breath",
  es: "Dificultad para respirar",
  category: "Síntomas",
  subcategory: "Respiratorio",
  pronunciation: "/short-nes ov breth/",
  definition: "Sensación de falta de aire o dificultad para respirar.",
  context: "The patient reports shortness of breath at rest.",
  abbreviation: "",
  caution: "No traducir literalmente.",
  sourceName: "MedlinePlus",
  sourceUrl: "https://medlineplus.gov/spanish/",
  reviewStatus: "Borrador",
  reviewedBy: "",
  reviewDate: ""
}
```

Antes de publicar nuevos términos, verifica la traducción, definición, contexto, fuente y fecha de revisión con profesionales cualificados.

### Estados de revisión

- **Borrador:** añadido, todavía no revisado.
- **Pendiente:** listo para revisión profesional.
- **Verificado:** revisado, fechado y con nombre del revisor.
- **Requiere actualización:** debe revisarse de nuevo antes de publicarse.

### Control de publicación

La revisión y la publicación son controles separados:

- **Demo:** visible únicamente como contenido demostrativo del MVP.
- **Oculto:** permanece en la base interna, pero no aparece en la web.
- **Publicado:** aparece públicamente y exige estado **Verificado**, revisor y fecha.

El generador bloquea cualquier intento de publicar un término que todavía no esté verificado.

La estructura también admite tipos de entrada, varios significados, notas de contexto, variantes regionales, prioridad, frecuencia, dificultad e historial de cambios.

## Privacidad y uso responsable

Ebanks Interpreter Studio es una herramienta educativa y de apoyo terminológico.

- No introduzcas nombres, diagnósticos ni información identificable de pacientes.
- La plataforma no graba ni traduce conversaciones.
- No sustituye al intérprete profesional.
- No ofrece diagnósticos ni asesoramiento médico.
- El contenido demostrativo requiere revisión profesional antes de utilizarse en producción.

Los favoritos se almacenan únicamente en el navegador del usuario mediante `localStorage`.

## Metadatos, SEO y favicon

La versión **1.6.0** conserva e integra los metadatos técnicos y sociales en `index.html`:

- título y descripción SEO;
- autor, robots, color del navegador y URL canónica;
- Open Graph para Facebook, LinkedIn y aplicaciones de mensajería;
- Twitter Card;
- datos estructurados `WebApplication` mediante JSON-LD;
- favicon multirresolución y variantes PNG;
- icono para iPhone/iPad;
- manifiesto web para instalación y accesos directos.

La URL canónica configurada es:

```text
https://clentebanks.github.io/Ebanks-Interpreter-Studio/
```

Si el sitio se publica en otro dominio, deben actualizarse `canonical`, `og:url`, `og:image`, `twitter:image` y el campo `url` del JSON-LD en `index.html`.

## Estado del proyecto

Esta versión contiene 1104 fichas terminológicas. La actualización **Supplies 1** procesó 104 pares bilingües: añadió 97 fichas, actualizó 5 registros existentes y consolidó 2 filas repetidas dentro de la propia lista. La meta es construir una colección bilingüe revisada para los principales contextos OPI, manteniendo el área médica como especialidad prioritaria.

## Importación Medical Acronyms

La importación del 27 de julio de 2026 se documenta en:

```text
data/import-medical-acronyms-report.json
```

Los registros añadidos permanecen como **Borrador** y contenido **Demo** hasta completar revisión profesional. Se normalizaron siglas ambiguas o incorrectas, incluyendo ECG/EKG, PFO, DTaP/Tdap, CPAP y TMJ/TMD.

## Importación de medicamentos recetados comunes

La importación del 27 de julio de 2026 se documenta en:

```text
data/import-prescribed-medications-report.json
data/most-common-prescribed-medications-source.csv
docs/sources/most-common-prescribed-medications.pdf
```

Los 57 renglones del documento fuente generaron 58 fichas nuevas. Pravastatina y simvastatina se separaron para que cada medicamento tenga una ficha propia. Las marcas comerciales se añadieron como sinónimos de búsqueda. Todos los registros permanecen como **Borrador** y contenido **Demo** hasta completar revisión profesional.

## Importación Medical Verbs

La importación del 28 de julio de 2026 se documenta en:

```text
data/import-medical-verbs-report.json
data/medical-verbs-source.csv
```

Se procesaron 95 pares bilingües. Se añadieron 83 fichas y se actualizaron 12 fichas existentes sin duplicarlas. Las formas originales se conservaron en el archivo fuente y como sinónimos o notas cuando fue necesario normalizar grafías como `Inject`, `Disinfect`, `Lose balance`, `Lose consciousness`, `Lie down`, `Miss a dose`, `Mix / stir` y `Overeat`. Todos los registros nuevos permanecen como **Borrador** y contenido **Demo** hasta completar revisión profesional.

## Importación Supplies 1

La importación del 28 de julio de 2026 se documenta en:

```text
data/import-supplies-1-report.json
data/supplies-1-source.csv
```

Se procesaron 104 pares bilingües. Se añadieron 97 fichas, se actualizaron 5 fichas existentes sin duplicarlas y se consolidaron 2 filas repetidas dentro de la lista. Las expresiones originales permanecen registradas en el CSV fuente. No se realizó verificación médica externa; todos los registros nuevos permanecen como **Borrador** y contenido **Demo** hasta completar revisión profesional.

## Hoja de ruta

- Ampliar y verificar la base terminológica.
- Añadir fuentes y fechas de revisión a cada ficha.
- Incorporar sinónimos y variantes regionales.
- Mejorar pronunciación y accesibilidad.
- Crear listas personalizadas por sesión o especialidad.
- Añadir cuestionarios y escenarios de práctica.
- Incorporar vocabulario de seguros, finanzas y áreas legales.
- Preparar una aplicación web progresiva con funcionamiento sin conexión.

## Autor

Creado por **Clent Ebanks**.

Un producto de **Ebanks Labs**.

## Licencia

Copyright © 2026 Clent Ebanks. Todos los derechos reservados.

Este repositorio no incluye actualmente una licencia de código abierto. No se permite copiar, redistribuir, modificar o utilizar comercialmente el proyecto sin autorización expresa del autor.


## Escenarios profesionales

La interfaz incluye siete escenarios de preparación rápida:

- Accidente de tránsito
- Sala de emergencias
- Corte
- Banco
- Seguro médico
- Policía
- Ambulancia

Cada escenario aplica un filtro contextual sobre la base terminológica. Los escenarios
se configuran en `js/app.js`, dentro de la constante `scenarios`.

## Escenarios de preparación

Los escenarios se administran en `data/scenarios.json` y se cargan en el navegador mediante `js/scenarios-data.js`. Cada escenario contiene únicamente IDs de términos ya existentes en `data/terms.json`; no duplica ni crea vocabulario. Un mismo término puede pertenecer a varios escenarios. Si no existe vocabulario compatible, el arreglo `termIds` permanece vacío.



### Corrección 1.5.1 del favicon

Se eliminó el espacio transparente excesivo del icono, se amplió el emblema para ocupar el área visible del favicon y se añadió versionado en las referencias HTML para evitar que el navegador conserve la versión diminuta en caché.

# Ebanks Interpreter Studio

Plataforma bilingüe de terminología, consulta rápida y práctica para intérpretes profesionales de inglés y español.

**Ebanks Interpreter Studio** está diseñado para ayudar a intérpretes OPI y otros profesionales a localizar términos, abreviaturas y equivalencias con rapidez. La primera versión se enfoca en terminología médica y puede ampliarse posteriormente a seguros, finanzas, interpretación legal y otras especialidades.

> **El término correcto, justo cuando lo necesitas.**

## Funciones

- Búsqueda bidireccional en inglés y español.
- Consulta de abreviaturas médicas.
- Filtros por categorías.
- Fichas terminológicas con definición y contexto.
- Pronunciación escrita para términos en inglés.
- Advertencias sobre falsos cognados y errores frecuentes.
- Favoritos guardados en el navegador.
- Lista personal de términos.
- Tarjetas interactivas de práctica.
- Diseño adaptable a computadoras, tabletas y teléfonos.

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
├── css/
│   └── styles.css
├── data/
│   ├── terms.csv
│   └── terms.json
├── docs/
│   └── plantilla-terminologia-ebanks-interpreter-studio.xlsx
├── js/
│   ├── app.js
│   └── data.js
├── scripts/
│   └── generate-terms.js
├── package.json
└── README.md
```

## Cómo utilizarlo

1. Descarga o clona el repositorio.
2. Abre `index.html` en un navegador moderno.
3. Utiliza el buscador para consultar términos en inglés, español o por abreviatura.

También puedes publicar la carpeta directamente en Netlify, GitHub Pages u otro servicio de alojamiento estático.

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
- La plataforma no graba ni traduce conversaciones médicas.
- No sustituye al intérprete profesional.
- No ofrece diagnósticos ni asesoramiento médico.
- El contenido demostrativo requiere revisión profesional antes de utilizarse en producción.

Los favoritos se almacenan únicamente en el navegador del usuario mediante `localStorage`.

## Estado del proyecto

Esta es una versión MVP con una colección pequeña de términos demostrativos. La meta inicial es construir una colección bilingüe verificada de 500 términos médicos.

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

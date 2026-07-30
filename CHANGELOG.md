# Changelog

Los cambios relevantes de Ebanks Interpreter Studio se documentan en este archivo.

## [1.7.0] - 2026-07-30

### Añadido

- Importación del documento Medical Glossary de 28 páginas.
- 867 fichas terminológicas nuevas.
- 221 fichas existentes enriquecidas sin duplicarlas.
- Registro de las 1,149 filas fuente en `data/medical-glossary-source.csv`.
- Reporte completo en `data/import-medical-glossary-report.json`.
- Documento original archivado en `docs/sources/medical-glossary-interactive-contact-center.docx`.
- Documentación editorial y técnica en `docs/import-medical-glossary.md`.
- Validador `scripts/validate-medical-glossary.js`.
- Comando `npm run validate:medical-glossary`.

### Cambiado

- Total de fichas aumentado de 1,104 a 1,971.
- 61 filas repetidas del documento fuente consolidadas en fichas únicas.
- Traducciones alternativas almacenadas como sinónimos en lugar de crear entradas repetidas.
- Siglas separadas del término principal cuando estaban escritas con guion.
- Versión del proyecto actualizada de 1.6.0 a 1.7.0.
- `npm run check` ahora valida tanto el recorrido guiado como la importación Medical Glossary.
- Se eliminó una copia antigua y accidental del proyecto que estaba anidada dentro de `css/`; la carpeta conserva únicamente las hojas de estilo activas.

### Documentado

- Mapeo de las 26 secciones del documento hacia las categorías del proyecto.
- Política de deduplicación, trazabilidad y revisión profesional.
- Correcciones estructurales limitadas para columnas invertidas, traducción contradictoria y conflicto de la sigla ECG.

## [1.6.0] - 2026-07-30

### Añadido

- Tour guiado de primera visita con diez pasos.
- Resaltado visual de cada función explicada.
- Controles Anterior, Siguiente, Omitir guía y Finalizar.
- Barra de progreso e indicador de paso.
- Navegación mediante teclado y cierre con `Esc`.
- Botón permanente Guía para repetir el recorrido.
- Persistencia de primera visita mediante `localStorage` versionado.
- Diseño adaptable para computadora, tableta y teléfono.
- Eventos opcionales de analítica para inicio, repetición, finalización y omisión.
- Validador `scripts/validate-onboarding.js`.
- Documentación técnica y editorial en `docs/onboarding-tour.md`.

### Cambiado

- Versión del proyecto actualizada de 1.5.1 a 1.6.0.
- README ampliado con instalación, uso y mantenimiento del recorrido.

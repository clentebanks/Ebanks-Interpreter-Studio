# Importación Medical Glossary

## Resumen

La versión 1.7.0 incorpora al proyecto el documento **Medical Glossary** proporcionado por el usuario. El archivo fuente contiene vocabulario bilingüe médico organizado por sistemas del cuerpo, especialidades, profesiones, pruebas, procedimientos, suministros, síntomas, enfermedades, medicamentos, verbos y acrónimos.

La importación se realizó sobre la base maestra `data/terms.csv`, sin crear una segunda base independiente.

## Resultado de la importación

| Métrica | Resultado |
|---|---:|
| Páginas del documento | 28 |
| Secciones detectadas | 26 |
| Filas bilingües no vacías | 1,149 |
| Términos fuente únicos tras consolidación | 1,088 |
| Fichas existentes antes de importar | 1,104 |
| Fichas nuevas añadidas | 867 |
| Fichas existentes actualizadas | 221 |
| Filas repetidas consolidadas dentro de la fuente | 61 |
| Total final de fichas | 1,971 |
| Rango de IDs nuevos | 1106–1972 |

## Archivos relacionados

```text
docs/sources/medical-glossary-interactive-contact-center.docx
data/medical-glossary-source.csv
data/import-medical-glossary-report.json
scripts/validate-medical-glossary.js
```

### Documento fuente

`docs/sources/medical-glossary-interactive-contact-center.docx` conserva el documento original entregado por el usuario.

### Registro de procedencia

`data/medical-glossary-source.csv` conserva cada fila del documento con:

- sección;
- número de fila dentro de la sección;
- texto original en inglés y español;
- sigla original cuando existe;
- forma canónica utilizada por el proyecto;
- acción realizada;
- ID final relacionado;
- referencia al duplicado consolidado;
- nota de normalización.

### Reporte técnico

`data/import-medical-glossary-report.json` contiene las cifras completas, el mapeo de categorías, las normalizaciones documentadas y el listado de fichas añadidas o actualizadas.

## Política de eliminación de repetidos

La importación aplica estas reglas:

1. Las filas repetidas dentro del DOCX se agrupan por el término inglés normalizado.
2. Cuando el mismo término aparece con traducciones distintas, se conserva una traducción principal y las demás se guardan como sinónimos en español.
3. Cuando el término ya existe en `data/terms.csv`, se actualiza esa ficha en lugar de crear otra.
4. Las variantes de escritura en inglés se conservan como sinónimos cuando son útiles para la búsqueda.
5. Las siglas se integran en el campo `abbreviation` sin eliminar la forma original del archivo de procedencia.
6. Los IDs existentes no se cambian, por lo que los escenarios y favoritos continúan siendo compatibles.

La validación final confirma que la importación no añadió nuevos duplicados normalizados de términos ingleses. Los cinco casos históricos que ya existían antes de esta importación permanecen separados porque representan usos contextuales distintos.

## Mapeo editorial de secciones

| Sección del documento | Categoría del proyecto | Subcategoría |
|---|---|---|
| Body Parts | Anatomía | Partes del cuerpo |
| Brain and Nervous System | Anatomía | Sistema nervioso |
| Cardiovascular System | Anatomía | Sistema cardiovascular |
| Skeletal System | Anatomía | Sistema musculoesquelético |
| Lymphatic System | Anatomía | Sistema linfático |
| Male Reproductive System | Anatomía | Sistema reproductor masculino |
| Female Reproductive System | Anatomía | Sistema reproductor femenino |
| Digestive System | Anatomía | Sistema digestivo |
| Head and Respiratory System | Anatomía | Cabeza y sistema respiratorio |
| Endocrine System | Anatomía | Sistema endocrino |
| Hormones and Neurotransmitters | Anatomía | Hormonas y neurotransmisores |
| Specialties & Facilities | Especialidades | Especialidades y centros |
| Medical Professions | Atención médica | Profesiones médicas |
| Ophtalmology | Atención médica | Oftalmología |
| Dermatology | Atención médica | Dermatología |
| Dental | Atención médica | Odontología |
| Genetics | Atención médica | Genética |
| OBGYN | Maternidad y pediatría | Ginecoobstetricia |
| Tests and Procedures | Procedimientos | Pruebas y procedimientos |
| Medical Supplies | Atención médica | Suministros médicos |
| Symptoms, conditions | Síntomas | Síntomas y condiciones |
| Types of pain | Síntomas | Tipos de dolor |
| Types of medications | Medicamentos | Tipos de medicamentos |
| Diseases and Chronic Conditions | Condiciones | Enfermedades y condiciones crónicas |
| Verbs | Atención médica | Verbos médicos |
| Acronyms | Atención médica | Acrónimos médicos |

## Normalizaciones limitadas y documentadas

No se realizó una revisión médica externa ni se sustituyó de forma general la terminología del documento. Solo se aplicaron correcciones estructurales necesarias para evitar resultados claramente contradictorios:

- La fila `Empeine del pie / Instep` estaba colocada con las columnas invertidas; se registró como `Instep / Empeine del pie`.
- `Descending Colon / Colon ascendente` se registró como `Descending Colon / Colon descendente`, porque la misma tabla ya contiene `Ascending Colon / Colon ascendente`.
- La fuente relaciona `ECG` con `Echocardiogram`; esa sigla no se publicó en esa ficha porque el proyecto ya utiliza `ECG / EKG` para `Electrocardiogram`. La forma original permanece en el CSV de procedencia.
- Las siglas escritas junto al término con guion se separaron al campo de abreviatura para mejorar la búsqueda.

Las formas problemáticas se conservan únicamente en el archivo fuente y en el CSV de auditoría; no se publican como sinónimos cuando podrían producir resultados incorrectos.

## Estado editorial de las fichas nuevas

Todas las fichas nuevas se añadieron con:

```text
review_status: Borrador
publication_status: Demo
```

Esto significa que están disponibles para pruebas del proyecto, pero siguen pendientes de revisión terminológica profesional. La importación no afirma que todas las equivalencias del documento sean clínicamente definitivas.

## Regeneración de datos

La fuente maestra continúa siendo:

```text
data/terms.csv
```

Después de editarla, ejecuta:

```bash
npm run generate
```

El comando regenera:

```text
data/terms.json
js/data.js
```

## Validación

Para comprobar la integridad de esta importación:

```bash
npm run validate:medical-glossary
```

El validador comprueba:

- presencia del DOCX fuente, CSV de procedencia y reporte JSON;
- existencia de todos los IDs referenciados;
- concordancia entre las cifras del reporte y los archivos reales;
- ausencia de pares bilingües exactos duplicados;
- cantidad de fichas nuevas vinculadas al documento.

La validación completa del proyecto se ejecuta con:

```bash
npm run check
```

## Mantenimiento futuro

Al añadir una nueva lista de vocabulario:

1. conservar el documento original dentro de `docs/sources/`;
2. registrar cada fila en un CSV de procedencia;
3. buscar coincidencias antes de asignar nuevos IDs;
4. combinar variantes como sinónimos en vez de duplicar fichas;
5. mantener los registros nuevos como `Borrador` y `Demo` hasta su revisión;
6. generar un reporte de importación con cifras verificables;
7. ejecutar `npm run generate` y `npm run check` antes de publicar.

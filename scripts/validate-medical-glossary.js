const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const termsFile = path.join(root, "data", "terms.csv");
const sourceFile = path.join(root, "data", "medical-glossary-source.csv");
const reportFile = path.join(root, "data", "import-medical-glossary-report.json");
const sourceDocument = path.join(root, "docs", "sources", "medical-glossary-interactive-contact-center.docx");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n") {
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r" && char !== "\ufeff") {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const requiredFiles = [termsFile, sourceFile, reportFile, sourceDocument];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));
if (missingFiles.length) {
  console.error("Faltan archivos de la importación Medical Glossary:");
  missingFiles.forEach((file) => console.error(`- ${path.relative(root, file)}`));
  process.exit(1);
}

const terms = parseCSV(fs.readFileSync(termsFile, "utf8"));
const sourceRows = parseCSV(fs.readFileSync(sourceFile, "utf8"));
const report = JSON.parse(fs.readFileSync(reportFile, "utf8"));
const errors = [];

const termIds = new Set(terms.map((term) => Number(term.id)));
const pairSet = new Set();
for (const term of terms) {
  const pair = `${normalize(term.english)}|${normalize(term.spanish)}`;
  if (pairSet.has(pair)) errors.push(`Ficha bilingüe duplicada: ${term.english} / ${term.spanish}`);
  pairSet.add(pair);
}

for (const row of sourceRows) {
  const resultingId = Number(row.resulting_id);
  if (!termIds.has(resultingId)) {
    errors.push(`La fila fuente ${row.source_index} apunta a un ID inexistente: ${row.resulting_id}`);
  }
  if (!row.action) errors.push(`La fila fuente ${row.source_index} no tiene acción documentada.`);
  if (!row.original_english || !row.original_spanish) {
    errors.push(`La fila fuente ${row.source_index} no conserva el par bilingüe original.`);
  }
}

const actionCounts = sourceRows.reduce((counts, row) => {
  counts[row.action] = (counts[row.action] || 0) + 1;
  return counts;
}, {});

const expectedRows = Number(report.source_rows_detected);
const expectedAfter = Number(report.records_after);
const expectedDuplicates = Number(report.source_rows_consolidated_as_duplicates);

if (sourceRows.length !== expectedRows) {
  errors.push(`El CSV fuente contiene ${sourceRows.length} filas; el reporte declara ${expectedRows}.`);
}
if (terms.length !== expectedAfter) {
  errors.push(`terms.csv contiene ${terms.length} fichas; el reporte declara ${expectedAfter}.`);
}
if ((actionCounts.consolidated_source_duplicate || 0) !== expectedDuplicates) {
  errors.push(
    `El CSV fuente registra ${actionCounts.consolidated_source_duplicate || 0} duplicados consolidados; ` +
    `el reporte declara ${expectedDuplicates}.`
  );
}

const importedTerms = terms.filter((term) => term.source_url === "documento-local:docs/sources/medical-glossary-interactive-contact-center.docx");
if (importedTerms.length !== Number(report.new_records_added)) {
  errors.push(
    `Se encontraron ${importedTerms.length} fichas nuevas vinculadas al documento; ` +
    `el reporte declara ${report.new_records_added}.`
  );
}

if (errors.length) {
  console.error(`\nValidación Medical Glossary fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("✅ Importación Medical Glossary validada.");
console.log(`   Filas fuente: ${sourceRows.length}`);
console.log(`   Fichas nuevas: ${report.new_records_added}`);
console.log(`   Fichas actualizadas: ${report.existing_records_updated_without_duplication}`);
console.log(`   Filas repetidas consolidadas: ${expectedDuplicates}`);
console.log(`   Total de fichas: ${terms.length}`);

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const input = path.join(root, "data", "terms.csv");
const jsonOutput = path.join(root, "data", "terms.json");
const jsOutput = path.join(root, "js", "data.js");
const allowedStatus = new Set(["Borrador", "Pendiente", "Verificado", "Requiere actualización"]);
const allowedPublication = new Set(["Demo", "Oculto", "Publicado"]);
const allowedEntryTypes = new Set(["Término", "Abreviatura", "Frase", "Falso cognado", "Acrónimo"]);
const required = ["id", "english", "spanish", "category", "definition_es", "source_name", "source_url", "review_status", "entry_type", "priority", "publication_status"];

function parseCSV(text) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(cell.trim()); cell = ""; }
    else if (char === "\n") { row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; }
    else if (char !== "\r") cell += char;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows;
}

const rows = parseCSV(fs.readFileSync(input, "utf8"));
const headers = rows.shift();
const errors = []; const warnings = []; const ids = new Set(); const pairs = new Set();
const records = rows.map((values, index) => Object.fromEntries(headers.map((header, i) => [header, values[i] || ""]))).map((item, index) => {
  const line = index + 2;
  required.forEach(field => { if (!item[field]) errors.push(`Fila ${line}: falta ${field}.`); });
  const id = Number(item.id);
  if (!Number.isInteger(id) || id <= 0) errors.push(`Fila ${line}: id inválido.`);
  if (ids.has(id)) errors.push(`Fila ${line}: id duplicado ${id}.`); ids.add(id);
  const pair = `${item.english}|${item.spanish}`.toLowerCase();
  if (pairs.has(pair)) errors.push(`Fila ${line}: término duplicado ${item.english}.`); pairs.add(pair);
  if (!allowedStatus.has(item.review_status)) errors.push(`Fila ${line}: estado de revisión inválido.`);
  if (!allowedPublication.has(item.publication_status)) errors.push(`Fila ${line}: estado de publicación inválido.`);
  if (!allowedEntryTypes.has(item.entry_type)) errors.push(`Fila ${line}: tipo de entrada inválido.`);
  if (item.review_status === "Verificado" && (!item.reviewed_by || !item.review_date)) errors.push(`Fila ${line}: un término verificado necesita revisor y fecha.`);
  if (item.publication_status === "Publicado" && item.review_status !== "Verificado") errors.push(`Fila ${line}: solo un término Verificado puede publicarse.`);
  if (!/^(https?:\/\/|documento-local:)/.test(item.source_url)) errors.push(`Fila ${line}: fuente inválida.`);
  if (!item.clinical_context) warnings.push(`Fila ${line}: falta contexto clínico.`);
  if (!item.pronunciation) warnings.push(`Fila ${line}: falta pronunciación.`);
  return {
    id, en:item.english, es:item.spanish, category:item.category, subcategory:item.subcategory,
    abbreviation:item.abbreviation, synonymsEn:item.synonyms_en, synonymsEs:item.synonyms_es,
    pronunciation:item.pronunciation, definition:item.definition_es, context:item.clinical_context,
    caution:item.caution, sourceName:item.source_name, sourceUrl:item.source_url,
    reviewStatus:item.review_status, reviewedBy:item.reviewed_by, reviewDate:item.review_date, notes:item.notes,
    entryType:item.entry_type, meaningGroup:item.meaning_group, contextNote:item.context_note,
    spanishNeutral:item.spanish_neutral, spanishUS:item.spanish_us, spanishLatam:item.spanish_latam,
    regionalVariants:item.regional_variants, priority:item.priority, frequency:item.frequency,
    difficulty:item.difficulty, publicationStatus:item.publication_status,
    sourceAccessedDate:item.source_accessed_date, createdDate:item.created_date,
    updatedDate:item.updated_date, version:item.version, changeNotes:item.change_notes
  };
});

if (warnings.length) console.warn(`\nAdvertencias (${warnings.length}):\n- ${warnings.join("\n- ")}\n`);
if (errors.length) { console.error(`\nNo se generaron archivos. Corrige estos errores (${errors.length}):\n- ${errors.join("\n- ")}\n`); process.exit(1); }
fs.writeFileSync(jsonOutput, JSON.stringify(records, null, 2) + "\n");
fs.writeFileSync(jsOutput, `// Generado automáticamente desde data/terms.csv. No editar manualmente.\nwindow.INTERPRETER_TERMS = ${JSON.stringify(records, null, 2)};\n`);
console.log(`✓ ${records.length} términos validados.`);
console.log("✓ data/terms.json generado.");
console.log("✓ js/data.js generado.");

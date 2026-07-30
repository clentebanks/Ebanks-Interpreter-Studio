"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = {
  html: path.join(root, "index.html"),
  css: path.join(root, "css", "onboarding.css"),
  js: path.join(root, "js", "onboarding.js"),
  docs: path.join(root, "docs", "onboarding-tour.md")
};

const errors = [];

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Falta el archivo ${name}: ${path.relative(root, filePath)}`);
  }
}

if (!errors.length) {
  const html = fs.readFileSync(files.html, "utf8");
  const js = fs.readFileSync(files.js, "utf8");

  const htmlChecks = [
    ["css/onboarding.css", "Falta enlazar css/onboarding.css"],
    ["js/onboarding.js", "Falta cargar js/onboarding.js"],
    ["class=\"tour-launcher\"", "Falta el botón .tour-launcher"]
  ];

  for (const [needle, message] of htmlChecks) {
    if (!html.includes(needle)) errors.push(message);
  }

  const requiredSelectors = [
    ".site-header nav",
    "#search-form",
    "#categorias",
    ".results-panel",
    ".term-card .term-top",
    ".scenarios-heading",
    ".resources-heading",
    "[data-view='practice']",
    ".tour-launcher"
  ];

  for (const selector of requiredSelectors) {
    if (!js.includes(`target: \"${selector}\"`)) {
      errors.push(`El tour no incluye el selector requerido: ${selector}`);
    }
  }

  const stepCount = (js.match(/\n\s*target:/g) || []).length;
  if (stepCount < 8) {
    errors.push(`El recorrido tiene ${stepCount} pasos; se esperaban al menos 8.`);
  }
}

if (errors.length) {
  console.error("\n❌ Validación del onboarding fallida:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\n✅ Tour guiado validado correctamente.");
console.log("   Archivos, enlaces y selectores principales presentes.\n");

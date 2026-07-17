(() => {
  "use strict";

  const terms = window.INTERPRETER_TERMS.filter(
    term => term.publicationStatus === "Publicado" || term.publicationStatus === "Demo"
  );

  const mainCategories = [
    "Todos",
    "Médico",
    "Legal",
    "Seguros médicos",
    "Acrónimos",
    "Partes de carros",
    "Bancos"
  ];

  const medicalCategories = new Set([
    "Anatomía",
    "Síntomas",
    "Condiciones",
    "Procedimientos",
    "Maternidad y pediatría",
    "Atención médica",
    "Cuidado domiciliario",
    "Medicamentos",
    "Especialidades",
    "Signos vitales",
    "Contexto",
    "Comunicación OPI"
  ]);

  let query = "";
  let category = "Todos";
  let selected = terms[0];
  let view = "dictionary";
  let card = 0;
  let revealed = false;
  let saved = JSON.parse(localStorage.getItem("is-saved-terms") || "[]");

  const $ = selector => document.querySelector(selector);

  const escape = value =>
    String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[character]);

  const normalize = value =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  function getMainCategory(term) {
    const explicit = term.mainCategory?.trim();
    if (explicit && mainCategories.includes(explicit)) return explicit;

    if (term.abbreviation?.trim()) return "Acrónimos";
    if (medicalCategories.has(term.category)) return "Médico";
    if (term.category === "Seguros y trámites") return "Seguros médicos";
    if (term.category === "Banca y pagos") return "Bancos";
    if (term.category === "Legal") return "Legal";
    if (term.category === "Partes de carros" || term.category === "Automotriz") {
      return "Partes de carros";
    }

    return "";
  }

  function matchesCategory(term) {
    if (category === "Todos") return true;
    return getMainCategory(term) === category;
  }

  const filtered = () =>
    terms.filter(term =>
      matchesCategory(term) &&
      (
        !query ||
        normalize(
          `${term.en} ${term.es} ${term.definition} ${term.abbreviation || ""} ` +
          `${term.synonymsEn || ""} ${term.synonymsEs || ""} ` +
          `${term.spanishNeutral || ""} ${term.spanishUS || ""} ` +
          `${term.spanishLatam || ""} ${term.regionalVariants || ""}`
        ).includes(normalize(query))
      )
    );

  function renderCategories() {
    $("#categorias").innerHTML = mainCategories
      .map(name => `
        <button
          class="${name === category ? "selected" : ""}"
          data-category="${escape(name)}"
        >${escape(name)}</button>
      `)
      .join("");
  }

  function renderList() {
    const items = view === "saved"
      ? terms.filter(term => saved.includes(term.id))
      : filtered();

    $("#result-count").textContent = `${items.length} resultados`;
    $("#results-title").textContent =
      view === "saved"
        ? "Mi lista"
        : query
          ? `Resultados para “${query}”`
          : category === "Todos"
            ? "Términos esenciales"
            : category;

    $("#term-list").innerHTML = items.length
      ? items.map(term => `
          <button
            class="${selected?.id === term.id ? "current" : ""}"
            data-term="${term.id}"
          >
            <span>
              <strong>${escape(term.en)}</strong>
              <small>${escape(term.es)}</small>
            </span>
            <em>${escape(getMainCategory(term) || term.category)}</em>
          </button>
        `).join("")
      : `
        <div class="empty">
          <h3>Esta categoría todavía no tiene términos</h3>
          <p>Prueba otra categoría, busca una palabra o selecciona “Todos”.</p>
        </div>
      `;
  }

  function renderCard() {
    if (!selected) {
      $("#term-card").innerHTML = `
        <div class="empty">
          <h3>Selecciona un término</h3>
          <p>Elige una ficha de la lista para ver todos sus detalles.</p>
        </div>
      `;
      return;
    }

    const term = selected;
    const mainCategory = getMainCategory(term);

    $("#term-card").innerHTML = `
      <div class="term-top">
        <div>
          <span class="category-label">${escape(mainCategory || term.category)}</span>
          <h2>${escape(term.en)}</h2>
          <h3>${escape(term.es)}</h3>
          <p class="pronunciation">🔊 ${escape(term.pronunciation)}</p>
        </div>
        <button id="save-term" class="${saved.includes(term.id) ? "saved" : ""}">
          ${saved.includes(term.id) ? "★ Guardado" : "☆ Guardar"}
        </button>
      </div>

      <div class="term-section">
        <small>DEFINICIÓN</small>
        <p>${escape(term.definition)}</p>
      </div>

      <div class="term-section context">
        <small>CONTEXTO DE USO</small>
        <p>“${escape(term.context)}”</p>
      </div>

      ${term.category ? `
        <div class="term-section">
          <small>CATEGORÍA ESPECÍFICA</small>
          <p>${escape(term.category)}</p>
        </div>
      ` : ""}

      ${term.subcategory ? `
        <div class="term-section">
          <small>SUBCATEGORÍA</small>
          <p>${escape(term.subcategory)}</p>
        </div>
      ` : ""}

      ${term.abbreviation ? `
        <div class="term-section">
          <small>ACRÓNIMO O ABREVIATURA</small>
          <p><strong>${escape(term.abbreviation)}</strong></p>
        </div>
      ` : ""}

      ${term.caution ? `
        <div class="caution">
          <strong>Atención al contexto</strong>
          <p>${escape(term.caution)}</p>
        </div>
      ` : ""}

      <footer>
        ✓ Ficha educativa · Requiere revisión profesional antes de publicación
      </footer>
    `;
  }

  function syncSelectedToVisibleItems() {
    const items = view === "saved"
      ? terms.filter(term => saved.includes(term.id))
      : filtered();

    if (!items.some(term => term.id === selected?.id)) {
      selected = items[0] || selected;
    }
  }

  function renderAll() {
    syncSelectedToVisibleItems();
    renderCategories();
    renderList();
    renderCard();
    $("#saved-count").textContent = saved.length;
    $("#term-total").textContent = terms.length;
  }

  function toggleSave() {
    saved = saved.includes(selected.id)
      ? saved.filter(id => id !== selected.id)
      : [...saved, selected.id];

    localStorage.setItem("is-saved-terms", JSON.stringify(saved));
    renderAll();
  }

  function showView(next) {
    view = next;

    $("#practice-view").classList.toggle("d-none", next !== "practice");
    $("#dictionary-view").classList.toggle("d-none", next === "practice");

    document.querySelectorAll("[data-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.view === next);
    });

    if (next === "saved") {
      $("#hero-title").textContent = "Tus términos guardados.";
    } else {
      $("#hero-title").innerHTML =
        "Encuentra el término correcto.<br>Interpreta con confianza.";
    }

    if (next === "practice") {
      renderPractice();
    } else {
      renderAll();
    }
  }

  function renderPractice() {
    const term = terms[card];

    $("#flashcard").innerHTML = `
      <small>Tarjeta ${card + 1} de ${terms.length}</small>
      <span class="category-label">${escape(getMainCategory(term) || term.category)}</span>
      <h2>${escape(term.en)}</h2>
      ${revealed
        ? `<h3>${escape(term.es)}</h3><p>${escape(term.definition)}</p>`
        : `<p class="reveal">Pulsa para revelar la respuesta</p>`
      }
    `;
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("button,[data-term]");
    if (!target) return;

    if (target.dataset.category) {
      category = target.dataset.category;
      view = "dictionary";
      query = "";
      $("#search-input").value = "";
      renderAll();
    }

    if (target.dataset.term) {
      selected = terms.find(term => term.id === Number(target.dataset.term));
      renderAll();
    }

    if (target.id === "save-term") toggleSave();
    if (target.dataset.view) showView(target.dataset.view);

    if (target.dataset.scroll) {
      document
        .getElementById(target.dataset.scroll)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $("#search-form").addEventListener("submit", event => {
    event.preventDefault();
    query = $("#search-input").value.trim();

    const first = filtered()[0];
    if (first) selected = first;

    renderAll();
  });

  $("#flashcard").addEventListener("click", () => {
    revealed = !revealed;
    renderPractice();
  });

  $("#flashcard").addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      revealed = !revealed;
      renderPractice();
    }
  });

  $("#previous-card").addEventListener("click", () => {
    card = (card - 1 + terms.length) % terms.length;
    revealed = false;
    renderPractice();
  });

  $("#next-card").addEventListener("click", () => {
    card = (card + 1) % terms.length;
    revealed = false;
    renderPractice();
  });

  renderAll();
})();

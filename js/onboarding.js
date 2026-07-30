(() => {
  "use strict";

  /**
   * Tour guiado de Ebanks Interpreter Studio.
   *
   * La versión forma parte de la clave de localStorage. Al cambiarla,
   * el recorrido vuelve a mostrarse automáticamente una vez a quienes
   * ya completaron una versión anterior.
   */
  const TOUR_VERSION = "1.0.0";
  const STORAGE_KEY = `eis-onboarding:${TOUR_VERSION}`;
  const AUTO_START_DELAY = 700;
  const TARGET_PADDING = 8;
  const VIEWPORT_MARGIN = 12;
  const POPOVER_GAP = 14;

  const steps = [
    {
      target: null,
      label: "Bienvenida",
      title: "Conoce Interpreter Studio en menos de dos minutos",
      description:
        "Este recorrido te mostrará cómo buscar terminología, explorar categorías, consultar fichas, prepararte por escenarios y guardar vocabulario para estudiarlo después.",
      tip: "Puedes cancelar el recorrido en cualquier momento y abrirlo de nuevo con el botón Guía."
    },
    {
      target: ".site-header nav",
      label: "Navegación",
      title: "Muévete entre las funciones principales",
      description:
        "Desde este menú puedes volver al diccionario, abrir la práctica con tarjetas, ir a escenarios, consultar recursos externos y revisar tus listas guardadas."
    },
    {
      target: "#search-form",
      label: "Búsqueda bilingüe",
      title: "Busca en inglés, español o por abreviatura",
      description:
        "Escribe un término completo o parcial. El buscador revisa equivalencias, abreviaturas, definiciones y otros campos relacionados para ayudarte a encontrar la ficha correcta.",
      tip: "No introduzcas nombres, diagnósticos ni información identificable de pacientes."
    },
    {
      target: "#categorias",
      label: "Filtros",
      title: "Reduce los resultados por contexto",
      description:
        "Selecciona una categoría como Médico, Legal, Seguros médicos, Acrónimos, Partes de carros o Bancos para concentrarte en el vocabulario de una llamada específica."
    },
    {
      target: ".results-panel",
      label: "Resultados",
      title: "Elige el término que deseas consultar",
      description:
        "La lista muestra los términos disponibles según tu búsqueda o filtro. Selecciona una fila para abrir todos sus detalles en la ficha terminológica."
    },
    {
      target: ".term-card .term-top",
      label: "Ficha terminológica",
      title: "Revisa traducción, pronunciación, contexto y advertencias",
      description:
        "Cada ficha reúne la equivalencia bilingüe, definición, ejemplo de uso, categoría, abreviatura y notas importantes. Usa Guardar para añadirla a Mis listas.",
      tip: "La herramienta apoya la preparación terminológica; no sustituye el criterio profesional del intérprete."
    },
    {
      target: ".scenarios-heading",
      label: "Preparación",
      title: "Prepárate por tipo de llamada",
      description:
        "Los escenarios reúnen automáticamente términos relacionados con situaciones como emergencias, seguros o accidentes para que puedas prepararte con mayor rapidez."
    },
    {
      target: ".resources-heading",
      label: "Recursos externos",
      title: "Verifica información con fuentes especializadas",
      description:
        "Accede a recursos para códigos postales, medicamentos, vocabulario médico y legal, seguros, banca y vehículos sin perder tu flujo de trabajo."
    },
    {
      target: "[data-view='practice']",
      label: "Práctica",
      title: "Refuerza vocabulario con tarjetas interactivas",
      description:
        "Abre Práctica para estudiar un término, revelar su equivalente y avanzar entre tarjetas. También puedes revisar únicamente tus términos guardados desde Mis listas."
    },
    {
      target: ".tour-launcher",
      label: "Listo para comenzar",
      title: "Puedes repetir esta guía cuando la necesites",
      description:
        "El recorrido solo se abre automáticamente en la primera visita. Después, utiliza el botón Guía para verlo otra vez desde el inicio."
    }
  ];

  let currentStep = 0;
  let active = false;
  let previousFocus = null;
  let positionFrame = null;

  const launcher = document.querySelector(".tour-launcher");

  if (!launcher) {
    console.warn("Onboarding: no se encontró el botón .tour-launcher.");
    return;
  }

  const root = document.createElement("div");
  root.className = "onboarding-tour";
  root.id = "onboarding-tour";
  root.hidden = true;
  root.innerHTML = `
    <div class="tour-shade tour-shade-top" aria-hidden="true"></div>
    <div class="tour-shade tour-shade-right" aria-hidden="true"></div>
    <div class="tour-shade tour-shade-bottom" aria-hidden="true"></div>
    <div class="tour-shade tour-shade-left" aria-hidden="true"></div>
    <div class="tour-highlight" aria-hidden="true"></div>

    <section class="tour-popover" role="dialog" aria-modal="true"
      aria-labelledby="tour-title" aria-describedby="tour-description" tabindex="-1">
      <div class="tour-progress-track" aria-hidden="true">
        <div class="tour-progress-bar"></div>
      </div>
      <div class="tour-content">
        <div class="tour-kicker">
          <span class="tour-label"></span>
          <span class="tour-step-count"></span>
        </div>
        <h2 class="tour-title" id="tour-title"></h2>
        <p class="tour-description" id="tour-description"></p>
        <p class="tour-tip"></p>
      </div>
      <div class="tour-actions">
        <button class="tour-button tour-button-skip" type="button" data-tour-skip>
          Omitir guía
        </button>
        <div class="tour-actions-group">
          <button class="tour-button" type="button" data-tour-previous>
            Anterior
          </button>
          <button class="tour-button tour-button-primary" type="button" data-tour-next>
            Siguiente
          </button>
        </div>
      </div>
    </section>
    <div class="tour-live-region" aria-live="polite" aria-atomic="true"></div>
  `;

  document.body.appendChild(root);

  const popover = root.querySelector(".tour-popover");
  const highlight = root.querySelector(".tour-highlight");
  const shades = {
    top: root.querySelector(".tour-shade-top"),
    right: root.querySelector(".tour-shade-right"),
    bottom: root.querySelector(".tour-shade-bottom"),
    left: root.querySelector(".tour-shade-left")
  };
  const label = root.querySelector(".tour-label");
  const count = root.querySelector(".tour-step-count");
  const title = root.querySelector(".tour-title");
  const description = root.querySelector(".tour-description");
  const tip = root.querySelector(".tour-tip");
  const progress = root.querySelector(".tour-progress-bar");
  const previousButton = root.querySelector("[data-tour-previous]");
  const nextButton = root.querySelector("[data-tour-next]");
  const skipButton = root.querySelector("[data-tour-skip]");
  const liveRegion = root.querySelector(".tour-live-region");

  function recordAnalytics(action) {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", `onboarding_${action}`, {
      onboarding_version: TOUR_VERSION,
      onboarding_step: currentStep + 1,
      onboarding_total_steps: steps.length
    });
  }

  function saveStatus(status) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status, completedAt: new Date().toISOString() })
      );
    } catch (error) {
      console.warn("Onboarding: no fue posible guardar el estado.", error);
    }
  }

  function hasSavedStatus() {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  }

  function getTarget(step) {
    if (!step.target) return null;
    return document.querySelector(step.target);
  }

  function getFocusableElements() {
    return [...popover.querySelectorAll(
      "button:not([hidden]):not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )];
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setRect(element, top, left, width, height) {
    element.style.top = `${Math.max(0, top)}px`;
    element.style.left = `${Math.max(0, left)}px`;
    element.style.width = `${Math.max(0, width)}px`;
    element.style.height = `${Math.max(0, height)}px`;
  }

  function positionShades(rect) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const left = Math.max(0, rect.left);
    const top = Math.max(0, rect.top);
    const right = Math.min(viewportWidth, rect.right);
    const bottom = Math.min(viewportHeight, rect.bottom);

    setRect(shades.top, 0, 0, viewportWidth, top);
    setRect(shades.bottom, bottom, 0, viewportWidth, viewportHeight - bottom);
    setRect(shades.left, top, 0, left, bottom - top);
    setRect(shades.right, top, right, viewportWidth - right, bottom - top);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function positionPopover(rect, hasTarget) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverRect = popover.getBoundingClientRect();
    const width = popoverRect.width;
    const height = popoverRect.height;

    if (!hasTarget) {
      popover.style.left = `${Math.round((viewportWidth - width) / 2)}px`;
      popover.style.top = `${Math.round((viewportHeight - height) / 2)}px`;
      return;
    }

    const candidates = [
      {
        top: rect.bottom + POPOVER_GAP,
        left: rect.left + (rect.width - width) / 2
      },
      {
        top: rect.top - height - POPOVER_GAP,
        left: rect.left + (rect.width - width) / 2
      },
      {
        top: rect.top + (rect.height - height) / 2,
        left: rect.right + POPOVER_GAP
      },
      {
        top: rect.top + (rect.height - height) / 2,
        left: rect.left - width - POPOVER_GAP
      }
    ];

    const fitting = candidates.find(candidate =>
      candidate.top >= VIEWPORT_MARGIN &&
      candidate.left >= VIEWPORT_MARGIN &&
      candidate.top + height <= viewportHeight - VIEWPORT_MARGIN &&
      candidate.left + width <= viewportWidth - VIEWPORT_MARGIN
    );

    const chosen = fitting || candidates[0];
    const left = clamp(
      chosen.left,
      VIEWPORT_MARGIN,
      Math.max(VIEWPORT_MARGIN, viewportWidth - width - VIEWPORT_MARGIN)
    );
    const top = clamp(
      chosen.top,
      VIEWPORT_MARGIN,
      Math.max(VIEWPORT_MARGIN, viewportHeight - height - VIEWPORT_MARGIN)
    );

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
  }

  function positionCurrentStep() {
    if (!active) return;

    const step = steps[currentStep];
    const target = getTarget(step);

    if (!target) {
      highlight.hidden = true;
      positionShades({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      });
      shades.top.style.width = "100vw";
      shades.top.style.height = "100vh";
      shades.right.style.width = "0";
      shades.bottom.style.height = "0";
      shades.left.style.width = "0";
      positionPopover(null, false);
      return;
    }

    highlight.hidden = false;

    const rawRect = target.getBoundingClientRect();
    const rect = {
      top: rawRect.top - TARGET_PADDING,
      left: rawRect.left - TARGET_PADDING,
      right: rawRect.right + TARGET_PADDING,
      bottom: rawRect.bottom + TARGET_PADDING,
      width: rawRect.width + TARGET_PADDING * 2,
      height: rawRect.height + TARGET_PADDING * 2
    };

    setRect(highlight, rect.top, rect.left, rect.width, rect.height);
    positionShades(rect);
    positionPopover(rect, true);
  }

  function schedulePosition() {
    cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(positionCurrentStep);
  }

  function ensureTargetVisible(target) {
    if (!target) return Promise.resolve();

    const rect = target.getBoundingClientRect();
    const safeTop = 96;
    const safeBottom = window.innerHeight - 96;
    const isVisible = rect.top >= safeTop && rect.bottom <= safeBottom;

    if (isVisible) return Promise.resolve();

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
      inline: "center"
    });

    return new Promise(resolve => window.setTimeout(resolve, 420));
  }

  async function showStep(index) {
    currentStep = clamp(index, 0, steps.length - 1);
    const step = steps[currentStep];
    const target = getTarget(step);

    label.textContent = step.label;
    count.textContent = `Paso ${currentStep + 1} de ${steps.length}`;
    title.textContent = step.title;
    description.textContent = step.description;
    tip.textContent = step.tip || "";
    tip.classList.toggle("is-visible", Boolean(step.tip));
    progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    previousButton.hidden = currentStep === 0;
    nextButton.textContent = currentStep === steps.length - 1
      ? "Finalizar"
      : "Siguiente";
    skipButton.textContent = currentStep === steps.length - 1
      ? "Cerrar"
      : "Omitir guía";

    liveRegion.textContent = `${count.textContent}. ${step.title}`;

    await ensureTargetVisible(target);
    schedulePosition();
    popover.focus({ preventScroll: true });
  }

  function startTour({ manual = false } = {}) {
    if (active) return;

    active = true;
    currentStep = 0;
    previousFocus = document.activeElement;
    root.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", schedulePosition);
    window.addEventListener("scroll", schedulePosition, true);
    recordAnalytics(manual ? "restart" : "start");
    showStep(0);
  }

  function closeTour(status) {
    if (!active) return;

    active = false;
    root.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", schedulePosition);
    window.removeEventListener("scroll", schedulePosition, true);
    cancelAnimationFrame(positionFrame);

    saveStatus(status);
    recordAnalytics(status);

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus({ preventScroll: true });
    } else {
      launcher.focus({ preventScroll: true });
    }
  }

  function goNext() {
    if (currentStep >= steps.length - 1) {
      closeTour("completed");
      return;
    }

    showStep(currentStep + 1);
  }

  function goPrevious() {
    if (currentStep <= 0) return;
    showStep(currentStep - 1);
  }

  function handleKeydown(event) {
    if (!active) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeTour("skipped");
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
      return;
    }

    trapFocus(event);
  }

  launcher.setAttribute("aria-controls", root.id);
  launcher.setAttribute("aria-expanded", "false");
  launcher.addEventListener("click", () => startTour({ manual: true }));
  previousButton.addEventListener("click", goPrevious);
  nextButton.addEventListener("click", goNext);
  skipButton.addEventListener("click", () => closeTour("skipped"));

  Object.values(shades).forEach(shade => {
    shade.addEventListener("click", () => closeTour("skipped"));
  });

  if (!hasSavedStatus()) {
    window.setTimeout(() => startTour(), AUTO_START_DELAY);
  }
})();

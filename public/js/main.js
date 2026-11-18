/* ==========================================================
   Lógica del portafolio
   1. Menú móvil
   2. Tarjetas de proyectos (Programación, 3D y Ediciones)
   3. Página de detalle de un proyecto
   4. Formulario de contacto
   ========================================================== */

/* ---------- 1. Menú móvil ---------- */
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".site-nav a").forEach((link) =>
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );
}

// Año del pie de página
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Barras de habilidades: se llenan al aparecer en pantalla ---------- */
const skillsList = document.querySelector("[data-skills]");
if (skillsList) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillsList.classList.add("is-visible");
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(skillsList);
  } else {
    skillsList.classList.add("is-visible");
  }
}

/* ---------- Utilidades ---------- */
const escapeHTML = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>`;

// Imagen (o portada) de la tarjeta. Si el proyecto tiene video, se agrega
// un clip sin sonido que se reproduce al pasar el mouse.
function cardMediaHTML(project) {
  if (!project.img) return `<div class="placeholder">Captura del proyecto<br>próximamente</div>`;
  const clip = project.preview || project.video;
  const back = project.vertical ? `<img class="media-back" src="${project.img}" alt="" aria-hidden="true" loading="lazy">` : "";
  const img = `<img class="media-poster" src="${project.img}" alt="${escapeHTML(project.title)}" loading="lazy" width="960" height="540">`;
  if (!clip) return img;
  return `${back}${img}
    <video class="card__preview" data-src="${clip}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
    <span class="card__play" aria-hidden="true">${PLAY_ICON}</span>`;
}

// Imagen o reproductor del detalle
function detailMediaHTML(project) {
  if (project.video) {
    return `<video class="detail__video" src="${project.video}" poster="${project.img || ""}" controls playsinline preload="metadata">
        Tu navegador no puede reproducir este video.
      </video>`;
  }
  if (project.img) return `<img src="${project.img}" alt="${escapeHTML(project.title)}" width="960" height="540">`;
  return `<div class="placeholder">Captura del proyecto<br>próximamente</div>`;
}

/* Vista previa en las tarjetas:
   - con mouse: se reproduce al pasar por encima
   - en celular: se reproduce cuando la tarjeta está en pantalla */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

function playPreview(card) {
  const video = card.querySelector(".card__preview");
  if (!video || reduceMotion) return;
  if (!video.src) video.src = video.dataset.src;
  video.play().then(() => card.classList.add("is-playing")).catch(() => {});
}
function stopPreview(card) {
  const video = card.querySelector(".card__preview");
  if (!video) return;
  video.pause();
  card.classList.remove("is-playing");
}

function activarPreviews(root) {
  const cards = [...root.querySelectorAll(".card")].filter((c) => c.querySelector(".card__preview"));
  if (!cards.length || reduceMotion) return;
  if (canHover) {
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => playPreview(card));
      card.addEventListener("mouseleave", () => stopPreview(card));
      card.addEventListener("focus", () => playPreview(card));
      card.addEventListener("blur", () => stopPreview(card));
    });
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? playPreview(e.target) : stopPreview(e.target)));
    }, { threshold: 0.6 });
    cards.forEach((card) => observer.observe(card));
  }
}

/* ---------- 2. Tarjetas ---------- */
function cardHTML(project) {
  const badge = project.badge ? `<span class="card__badge">${escapeHTML(project.badge)}</span>` : "";
  const mediaClass = "card__media" + (project.vertical ? " card__media--vertical" : "");
  return `
    <a class="card" href="proyecto.html?id=${project.id}">
      <div class="${mediaClass}">${cardMediaHTML(project)}${badge}</div>
      <div class="card__body">
        <span class="card__tag">${escapeHTML(project.tag)}</span>
        <h3 class="card__title">${escapeHTML(project.title)}</h3>
        <p class="card__text">${escapeHTML(project.short)}</p>
        <p class="card__tools">${project.tools.slice(0, 3).map(escapeHTML).join(" · ")}</p>
        <span class="card__link">Ver proyecto →</span>
      </div>
    </a>`;
}

/* Los proyectos vienen de la base de datos (GET /api/proyectos).
   Si el servidor no responde (por ejemplo, abriendo el HTML con doble clic),
   se usan los de js/data.js como respaldo. */
const API_BASE = location.protocol === "file:" ? "http://localhost:3000" : "";

async function cargarProyectos() {
  if (!document.querySelector("[data-project-grid], [data-project-sections], [data-project-detail]")) return null;
  try {
    const respuesta = await fetch(API_BASE + "/api/proyectos");
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    const lista = await respuesta.json();
    if (Array.isArray(lista) && lista.length) return lista;
    throw new Error("sin proyectos");
  } catch (error) {
    console.warn("No se pudieron leer los proyectos de la base de datos; se usan los de data.js.", error.message);
    return typeof PROJECTS !== "undefined" ? PROJECTS : [];
  }
}

function pintarProyectos(proyectos) {
  // Cuadrícula simple (Programación)
  document.querySelectorAll("[data-project-grid]").forEach((grid) => {
    const list = proyectos.filter((p) => p.folder === grid.dataset.projectGrid);
    grid.innerHTML = list.map(cardHTML).join("");
  });

  // Cuadrícula agrupada por secciones (3D & Animación)
  document.querySelectorAll("[data-project-sections]").forEach((wrap) => {
    const list = proyectos.filter((p) => p.folder === wrap.dataset.projectSections);
    const sections = [...new Set(list.map((p) => p.section))];
    wrap.innerHTML = sections
      .map(
        (name) => `
        <section class="subsection" aria-label="${escapeHTML(name)}">
          <h2 class="eyebrow">${escapeHTML(name)}</h2>
          <div class="grid grid--3">${list.filter((p) => p.section === name).map(cardHTML).join("")}</div>
        </section>`
      )
      .join("");
  });

  document.querySelectorAll("[data-project-grid], [data-project-sections]").forEach(activarPreviews);

  /* ---------- 3. Detalle ---------- */
  const detailRoot = document.querySelector("[data-project-detail]");
  if (detailRoot) {
    const id = new URLSearchParams(location.search).get("id");
    const project = proyectos.find((p) => p.id === id);

    if (!project) {
      detailRoot.innerHTML = `
        <div class="page-head">
          <h1 class="page-head__title">Proyecto no encontrado</h1>
          <p class="lead">El enlace no corresponde a ningún proyecto.</p>
          <div class="hero__actions"><a class="btn btn--primary" href="index.html#proyectos">Ver proyectos</a></div>
        </div>`;
    } else {
      const folder = FOLDERS[project.folder];
      const siblings = proyectos.filter((p) => p.folder === project.folder);
      const index = siblings.indexOf(project);
      const prev = siblings[index - 1];
      const next = siblings[index + 1];
      const pad = (n) => String(n).padStart(2, "0");

      if (folder.theme) document.body.classList.add(folder.theme);
      document.title = `${project.title} · Thaylor Hernandez`;

      detailRoot.innerHTML = `
        <div class="page-head__top">
          <a class="btn btn--ghost" href="${folder.page}">← Volver a ${escapeHTML(folder.name)}</a>
          <span class="soft">${pad(index + 1)} / ${pad(siblings.length)}</span>
        </div>
        <article class="detail">
          <div>
            <span class="chip chip--accent">${escapeHTML(project.tag)}</span>
            <h1 class="detail__title">${escapeHTML(project.title)}</h1>
            <p class="lead">${escapeHTML(project.desc)}</p>
            <h2 class="detail__label">${project.folder === "web" ? "Tecnologías" : "Herramientas"}</h2>
            <ul class="chips">${project.tools.map((t) => `<li class="chip">${escapeHTML(t)}</li>`).join("")}</ul>
            <h2 class="detail__label">${project.folder === "web" ? "Qué hace" : "Qué hice"}</h2>
            <ul class="detail__points">${project.points.map((t) => `<li>${escapeHTML(t)}</li>`).join("")}</ul>
          </div>
          <div class="detail__aside">
            <div class="detail__media${project.vertical ? " detail__media--vertical" : ""}${project.video ? " detail__media--video" : ""}">${detailMediaHTML(project)}</div>
          </div>
        </article>
        <nav class="detail__nav" aria-label="Navegación entre proyectos">
          ${prev ? `<a class="btn btn--ghost" href="proyecto.html?id=${prev.id}">← Anterior</a>` : "<span></span>"}
          ${
            next
              ? `<a class="btn btn--primary" href="proyecto.html?id=${next.id}">Siguiente →</a>`
              : `<a class="btn btn--primary" href="${folder.page}">Volver a ${escapeHTML(folder.name)}</a>`
          }
        </nav>`;
    }
  }
}

cargarProyectos().then((proyectos) => { if (proyectos) pintarProyectos(proyectos); });

/* ---------- 4. Formulario de contacto ----------
   Envía los datos al servidor (server.js), que los guarda en MongoDB
   y te avisa por correo. */

// Dirección de la API: usa API_BASE (arriba). Si publicas la página en GitHub Pages
// y el servidor en Render, cambia API_BASE por "https://tu-servidor.onrender.com".
const API_CONTACTO = API_BASE + "/api/contacto";

const form = document.querySelector("#contact-form");
if (form) {
  const success = document.querySelector("#form-success");
  const status = form.querySelector(".form__status");
  const submit = form.querySelector('button[type="submit"]');
  const submitText = submit.textContent;
  const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const phoneOK = (v) => /^[+\d][\d\s-]{6,}$/.test(v);

  const setError = (name, message) => {
    const field = form.querySelector(`[data-field="${name}"]`);
    if (!field) return;
    field.classList.toggle("has-error", Boolean(message));
    field.querySelector(".field__error").textContent = message || "";
  };
  const setStatus = (message) => { status.textContent = message || ""; };
  const setSending = (sending) => {
    submit.disabled = sending;
    submit.textContent = sending ? "Enviando…" : submitText;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");
    const data = Object.fromEntries(new FormData(form));
    const name = (data.nombre || "").trim();
    const phone = (data.telefono || "").trim();
    const email = (data.correo || "").trim();
    const message = (data.mensaje || "").trim();
    let valid = true;

    setError("nombre", name.length < 2 ? "Escribe tu nombre." : "");
    if (name.length < 2) valid = false;

    // Se necesita al menos un medio de contacto
    let phoneMsg = "", emailMsg = "";
    if (!phone && !email) {
      phoneMsg = emailMsg = "Deja tu número o tu correo.";
    } else {
      if (phone && !phoneOK(phone)) phoneMsg = "Revisa el número.";
      if (email && !emailOK(email)) emailMsg = "Revisa el correo.";
    }
    setError("telefono", phoneMsg);
    setError("correo", emailMsg);
    if (phoneMsg || emailMsg) valid = false;

    setError("mensaje", message.length < 10 ? "Cuéntame un poco más (mínimo 10 caracteres)." : "");
    if (message.length < 10) valid = false;

    if (!valid) {
      form.querySelector(".has-error input, .has-error textarea")?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch(API_CONTACTO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name, telefono: phone, correo: email, tipo: data.tipo, mensaje: message, sitio: data.sitio || "" })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Errores de cada campo que devuelve el servidor
        if (result.errores) {
          Object.entries(result.errores).forEach(([campo, texto]) => setError(campo, texto));
          form.querySelector(".has-error input, .has-error textarea")?.focus();
        }
        setStatus(result.error || "Revisa los campos marcados e intenta de nuevo.");
        return;
      }

      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      setStatus("No se pudo enviar el mensaje: el servidor no responde. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSending(false);
    }
  });

  document.querySelector("#form-reset")?.addEventListener("click", () => {
    form.reset();
    setStatus("");
    form.hidden = false;
    success.hidden = true;
  });
}

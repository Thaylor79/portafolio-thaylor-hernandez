/* ==========================================================
   Servidor del portafolio · Thaylor Hernandez
   - Muestra la página web (carpeta /public)
   - GET  /api/proyectos → los proyectos guardados en MongoDB
  - POST /api/contacto  → guarda el mensaje en MongoDB
                          y te avisa por correo
   Configuración: archivo .env (copia .env.example)
   ========================================================== */
// Configuración: lee ".env" o, si no existe, "configuracion.env"
require("dotenv").config({ path: [require("path").join(__dirname, ".env"), require("path").join(__dirname, "configuracion.env")], quiet: true });

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const Contacto = require("./models/Contacto");
const Proyecto = require("./models/Proyecto");
const { leerProyectos } = require("./proyectos-iniciales");
const { enviarAviso, correoConfigurado } = require("./correo");

const PUERTO = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI en el archivo .env (mira .env.example).");
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // necesario en hostings como Render para saber la IP real

/* ---------- Permitir que la página llame a la API desde otro dominio ----------
   (por ejemplo, la página en GitHub Pages y el servidor en Render).
   En ORIGENES_PERMITIDOS pon los dominios separados por coma, o * para todos. */
const origenes = (process.env.ORIGENES_PERMITIDOS || "*").split(",").map((o) => o.trim());
app.use("/api", (req, res, next) => {
  const origen = req.headers.origin;
  if (origenes.includes("*")) res.set("Access-Control-Allow-Origin", "*");
  else if (origen && origenes.includes(origen)) res.set({ "Access-Control-Allow-Origin": origen, Vary: "Origin" });
  res.set({ "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "20kb" }));

/* ---------- Página web ---------- */
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

/* ---------- API: proyectos ---------- */
const CAMPOS_PUBLICOS = "-_id id folder section badge tag title short desc tools points img video preview vertical";

// Todos los proyectos visibles (opcional: ?folder=web, ?folder=3d o ?folder=edicion)
app.get("/api/proyectos", async (req, res) => {
  try {
    const filtro = { visible: true };
    if (["web", "3d", "edicion"].includes(req.query.folder)) filtro.folder = req.query.folder;
    const proyectos = await Proyecto.find(filtro).select(CAMPOS_PUBLICOS).sort({ orden: 1 }).lean();
    res.json(proyectos);
  } catch (error) {
    console.error("Error al leer los proyectos:", error.message);
    res.status(500).json({ ok: false, error: "No se pudieron leer los proyectos." });
  }
});

// Un proyecto por su id
app.get("/api/proyectos/:id", async (req, res) => {
  try {
    const proyecto = await Proyecto.findOne({ id: req.params.id, visible: true }).select(CAMPOS_PUBLICOS).lean();
    if (!proyecto) return res.status(404).json({ ok: false, error: "Proyecto no encontrado." });
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ ok: false, error: "No se pudo leer el proyecto." });
  }
});

/* ---------- API: contacto ---------- */
// Máximo 5 mensajes cada 15 minutos por persona, para evitar spam
const limite = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, error: "Enviaste muchos mensajes seguidos. Intenta de nuevo en unos minutos." }
});

const texto = (valor, max) => (typeof valor === "string" ? valor.trim().slice(0, max) : "");
const correoValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const celularValido = (v) => /^[+\d][\d\s-]{6,}$/.test(v);

app.post("/api/contacto", limite, async (req, res) => {
  const cuerpo = req.body || {};

  // Campo trampa: las personas no lo ven; si viene lleno, es un robot
  if (texto(cuerpo.sitio, 200)) return res.status(201).json({ ok: true });

  const datos = {
    nombre: texto(cuerpo.nombre, 80),
    telefono: texto(cuerpo.telefono, 30),
    correo: texto(cuerpo.correo, 120).toLowerCase(),
    tipo: Contacto.TIPOS.includes(cuerpo.tipo) ? cuerpo.tipo : "Otro",
    mensaje: texto(cuerpo.mensaje, 3000)
  };

  // Las mismas reglas que revisa la página, por si alguien se las salta
  const errores = {};
  if (datos.nombre.length < 2) errores.nombre = "Escribe tu nombre.";
  if (!datos.telefono && !datos.correo) {
    errores.telefono = errores.correo = "Deja tu número o tu correo.";
  } else {
    if (datos.telefono && !celularValido(datos.telefono)) errores.telefono = "Revisa el número.";
    if (datos.correo && !correoValido(datos.correo)) errores.correo = "Revisa el correo.";
  }
  if (datos.mensaje.length < 10) errores.mensaje = "Cuéntame un poco más (mínimo 10 caracteres).";
  if (Object.keys(errores).length) return res.status(400).json({ ok: false, errores });

  try {
    // 1. Guardar en MongoDB
    const contacto = await Contacto.create(datos);

    // 2. Avisarte por correo (si falla, el mensaje igual queda guardado)
    try {
      await enviarAviso(contacto);
      contacto.correoEnviado = true;
      await contacto.save();
    } catch (error) {
      console.error("El mensaje se guardó, pero no se pudo enviar el correo:", error.message);
    }

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error.message);
    res.status(500).json({ ok: false, error: "No se pudo guardar tu mensaje. Intenta de nuevo en un momento." });
  }
});

// Para revisar que el servidor y la base de datos estén funcionando
app.get("/api/estado", async (req, res) => {
  const conectada = mongoose.connection.readyState === 1;
  const proyectos = conectada ? await Proyecto.countDocuments() : 0;
  const mensajes = conectada ? await Contacto.countDocuments() : 0;
  res.json({ servidor: "ok", baseDeDatos: conectada ? "conectada" : "desconectada", proyectos, mensajes, correo: correoConfigurado() ? "configurado" : "sin configurar" });
});

/* ---------- Arranque ---------- */
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✔ Conectado a MongoDB");

    // Cada vez que arranca, la base de datos se pone al día con public/js/data.js:
    // agrega los proyectos nuevos y actualiza los que cambiaron (según su id).
    // Si en Atlas pusiste visible: false a alguno, se respeta.
    const proyectos = leerProyectos();
    for (const p of proyectos) {
      await Proyecto.updateOne({ id: p.id }, { $set: p }, { upsert: true, runValidators: true });
    }
    console.log(`✔ ${proyectos.length} proyectos sincronizados con la base de datos.`);
    if (!correoConfigurado()) console.warn("⚠ El correo no está configurado: los mensajes se guardarán, pero no te llegarán avisos.");
    app.listen(PUERTO, () => console.log(`✔ Portafolio listo en http://localhost:${PUERTO}`));
  })
  .catch((error) => {
    console.error("No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  });

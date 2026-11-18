/* ==========================================================
   Modelo "Proyecto": cada trabajo del portafolio.
   Se guarda en la colección "proyectos" de MongoDB.
   Para agregar uno: créalo en MongoDB Atlas (Browse Collections)
   o agrégalo a public/js/data.js y ejecuta: npm run cargar-proyectos
   ========================================================== */
const mongoose = require("mongoose");

const proyectoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },   // se usa en la dirección: proyecto.html?id=...
    folder: { type: String, required: true, enum: ["web", "3d", "edicion"] }, // web = Programación, 3d = 3D & Animación, edicion = Ediciones
    section: { type: String, default: "" },                            // solo trabajos 3D
    badge: { type: String, default: "" },                              // solo trabajos 3D
    tag: { type: String, required: true },
    title: { type: String, required: true },
    short: { type: String, required: true },
    desc: { type: String, required: true },
    tools: { type: [String], default: [] },
    points: { type: [String], default: [] },
    img: { type: String, default: null },                              // imagen o portada del video
    video: { type: String, default: null },                            // video que se reproduce en el detalle
    preview: { type: String, default: null },                          // clip corto para la tarjeta
    vertical: { type: Boolean, default: false },                       // true = video 9:16
    orden: { type: Number, default: 0 },                               // orden en que aparecen
    visible: { type: Boolean, default: true }                          // false = se oculta sin borrarlo
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proyecto", proyectoSchema);

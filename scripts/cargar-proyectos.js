/* ==========================================================
   Copia los proyectos de public/js/data.js a MongoDB.
   Actualiza los que ya existen (según su id) y agrega los nuevos.
   Uso:  npm run cargar-proyectos
   ========================================================== */
// Configuración: lee ".env" o, si no existe, "configuracion.env"
require("dotenv").config({ path: [require("path").join(__dirname, "..", ".env"), require("path").join(__dirname, "..", "configuracion.env")], quiet: true });
const mongoose = require("mongoose");
const Proyecto = require("../models/Proyecto");
const { leerProyectos } = require("../proyectos-iniciales");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const proyectos = leerProyectos();
    for (const p of proyectos) {
      await Proyecto.updateOne({ id: p.id }, { $set: p }, { upsert: true, runValidators: true });
    }
    console.log(`✔ ${proyectos.length} proyectos guardados en MongoDB (colección "proyectos").`);
  } catch (error) {
    console.error("No se pudieron cargar los proyectos:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();

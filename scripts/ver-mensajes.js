/* ==========================================================
   Muestra en la terminal los últimos mensajes guardados.
   Uso:  npm run mensajes
   ========================================================== */
// Configuración: lee ".env" o, si no existe, "configuracion.env"
require("dotenv").config({ path: [require("path").join(__dirname, "..", ".env"), require("path").join(__dirname, "..", "configuracion.env")], quiet: true });
const mongoose = require("mongoose");
const Contacto = require("../models/Contacto");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const mensajes = await Contacto.find().sort({ createdAt: -1 }).limit(20).lean();
    if (!mensajes.length) {
      console.log("Todavía no hay mensajes guardados.");
    } else {
      console.log(`Últimos ${mensajes.length} mensajes:\n`);
      mensajes.forEach((m) => {
        console.log(`• ${new Date(m.createdAt).toLocaleString("es-CO", { timeZone: "America/Bogota" })} — ${m.nombre} (${m.tipo})`);
        console.log(`  Correo: ${m.correo || "-"} · Celular: ${m.telefono || "-"} · Aviso enviado: ${m.correoEnviado ? "sí" : "no"}`);
        console.log(`  ${m.mensaje.replace(/\s+/g, " ")}\n`);
      });
    }
  } catch (error) {
    console.error("No se pudo leer la base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();

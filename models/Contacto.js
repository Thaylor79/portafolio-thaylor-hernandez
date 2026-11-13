/* ==========================================================
   Modelo "Contacto": cada mensaje que llega desde el formulario.
   Se guarda en la colección "contactos" de MongoDB.
   ========================================================== */
const mongoose = require("mongoose");

const TIPOS = ["Página web", "Animación 3D", "Publicidad", "Otro"];

const contactoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    telefono: { type: String, trim: true, maxlength: 30, default: "" },
    correo: { type: String, trim: true, lowercase: true, maxlength: 120, default: "" },
    tipo: { type: String, enum: TIPOS, default: "Otro" },
    mensaje: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },

    // Para saber si el aviso llegó a tu correo
    correoEnviado: { type: Boolean, default: false },
    // Para marcar a mano en MongoDB Atlas los mensajes que ya respondiste
    leido: { type: Boolean, default: false }
  },
  { timestamps: true } // agrega createdAt y updatedAt
);

// Debe tener al menos un medio de contacto
contactoSchema.pre("validate", function () {
  if (!this.telefono && !this.correo) {
    this.invalidate("correo", "Deja tu número o tu correo.");
  }
});

module.exports = mongoose.model("Contacto", contactoSchema);
module.exports.TIPOS = TIPOS;

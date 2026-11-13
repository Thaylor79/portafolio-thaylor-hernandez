/* ==========================================================
   Aviso por correo cuando llega un mensaje nuevo.
   Dos formas de enviarlo (se usa la primera que esté configurada):

   1. Resend (RESEND_API_KEY) → envía por internet normal (HTTPS).
      Úsala cuando el portafolio esté publicado en Render: el plan
      gratis de Render bloquea los puertos de correo SMTP.
   2. Gmail (EMAIL_USER + EMAIL_PASS) → SMTP con "contraseña de aplicación".
      Funciona en tu computador. Sirve otro correo con SMTP
      cambiando EMAIL_HOST y EMAIL_PORT.
   ========================================================== */
const nodemailer = require("nodemailer");

const {
  EMAIL_USER,               // la cuenta que envía, ej: tucorreo@gmail.com
  EMAIL_PASS,               // la contraseña de aplicación de Gmail (16 letras)
  EMAIL_TO,                 // a dónde te llegan los avisos (si no lo pones, a EMAIL_USER)
  EMAIL_HOST = "smtp.gmail.com",
  EMAIL_PORT = "465",
  RESEND_API_KEY,           // clave de https://resend.com (opcional)
  RESEND_FROM = "Portafolio <onboarding@resend.dev>"
} = process.env;

const usarResend = () => Boolean(RESEND_API_KEY);
const usarSmtp = () => Boolean(EMAIL_USER && EMAIL_PASS);
const correoConfigurado = () => usarResend() || usarSmtp();
const destino = () => EMAIL_TO || EMAIL_USER;

let transporte = null;
function obtenerTransporte() {
  if (!transporte) {
    transporte = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
  }
  return transporte;
}

const escapar = (t) => String(t || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function enviarAviso(contacto) {
  if (!correoConfigurado()) throw new Error("correo sin configurar (RESEND_API_KEY, o EMAIL_USER y EMAIL_PASS)");

  const fecha = new Date(contacto.createdAt).toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "long", timeStyle: "short" });
  const filas = [
    ["Nombre", contacto.nombre],
    ["Correo", contacto.correo || "No lo dejó"],
    ["Celular", contacto.telefono || "No lo dejó"],
    ["Tipo de proyecto", contacto.tipo],
    ["Fecha", fecha]
  ];

  const texto =
    `Nuevo mensaje desde tu portafolio\n\n` +
    filas.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nLo que necesita:\n${contacto.mensaje}\n`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#14161d">
      <h2 style="margin:0 0 16px">Nuevo mensaje desde tu portafolio</h2>
      <table style="border-collapse:collapse;width:100%">
        ${filas.map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f2f3f7;font-weight:bold;width:150px">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #e3e5ec">${escapar(v)}</td></tr>`).join("")}
      </table>
      <h3 style="margin:22px 0 8px">Lo que necesita</h3>
      <p style="white-space:pre-wrap;background:#f2f3f7;padding:14px;border-radius:8px;margin:0">${escapar(contacto.mensaje)}</p>
      ${contacto.correo ? `<p style="margin-top:18px;color:#5b6070">Puedes responderle directamente a este correo.</p>` : ""}
    </div>`;

  const asunto = `Nuevo contacto: ${contacto.nombre} (${contacto.tipo})`;

  if (usarResend()) {
    if (!destino()) throw new Error("falta EMAIL_TO: a dónde te llegan los avisos");
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [destino()],
        reply_to: contacto.correo || undefined, // al darle "Responder", le escribes al cliente
        subject: asunto,
        text: texto,
        html
      })
    });
    if (!respuesta.ok) throw new Error(`Resend respondió ${respuesta.status}: ${await respuesta.text()}`);
    return;
  }

  await obtenerTransporte().sendMail({
    from: `"Portafolio" <${EMAIL_USER}>`,
    to: destino(),
    replyTo: contacto.correo || undefined, // al darle "Responder", le escribes al cliente
    subject: asunto,
    text: texto,
    html
  });
}

module.exports = { enviarAviso, correoConfigurado };

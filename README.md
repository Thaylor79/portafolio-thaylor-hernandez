# Portafolio · Thaylor Hernandez

Portafolio personal hecho con **HTML, CSS y JavaScript**, con un servidor en **Node.js + Express** y una base de datos **MongoDB** donde se guardan:

- **los proyectos** del portafolio (colección `proyectos`), que la página lee desde la API, y
- **los mensajes** del formulario de contacto (colección `contactos`), que además te llegan por **correo**.

## Cómo funcionan los proyectos

- `GET /api/proyectos` devuelve todos los proyectos (o `?folder=web` / `?folder=3d`).
- `GET /api/proyectos/:id` devuelve uno.
- La primera vez que arranca el servidor, si la base está vacía, copia los 17 proyectos de `public/js/data.js`.
- **Agregar o editar un proyecto:** en MongoDB Atlas → Browse Collections → `proyectos`, o edítalo en `data.js` y ejecuta `npm run cargar-proyectos`.
- **Ocultar un proyecto sin borrarlo:** pon `visible: false`.
- Si el servidor no responde, la página muestra los proyectos de `data.js` como respaldo.

## Cómo funciona el formulario

```
Cliente llena el formulario (contacto.html)
        │  fetch POST /api/contacto (JSON)
        ▼
server.js ── revisa los datos ──► MongoDB (colección "contactos")
        │
        └──► correo.js ──► te llega un correo con nombre, correo, celular,
                           tipo de proyecto y lo que necesita
```

- Si el correo falla, el mensaje **igual queda guardado** en MongoDB (campo `correoEnviado: false`).
- Al darle **Responder** al correo, le escribes directo al cliente.
- Protección contra spam: campo trampa invisible y máximo 5 envíos cada 15 minutos por persona.

## Estructura

```
Hernandez_Thaylor_Portafolio/
├── public/                 ← la página web (HTML, CSS, JS, imágenes, fuentes)
│   ├── index.html
│   ├── programacion.html
│   ├── animacion-3d.html
│   ├── proyecto.html
│   ├── contacto.html       ← formulario
│   ├── css/styles.css
│   └── js/                 ← data.js (proyectos) y main.js (menú, tarjetas, envío del formulario)
├── models/Proyecto.js      ← cómo se guarda cada proyecto en MongoDB
├── models/Contacto.js      ← cómo se guarda cada mensaje en MongoDB
├── proyectos-iniciales.js  ← lee los proyectos de data.js para la carga inicial
├── server.js               ← servidor Express + API /api/contacto
├── correo.js               ← envío del aviso por correo (Nodemailer)
├── scripts/ver-mensajes.js ← muestra los últimos mensajes en la terminal
├── scripts/cargar-proyectos.js ← copia data.js a MongoDB
├── .env.example            ← plantilla de la configuración
└── package.json
```

## Ponerlo a funcionar (una sola vez)

### 1. Instalar Node.js
Descárgalo de https://nodejs.org (versión LTS). Para comprobar: `node -v`.

### 2. Crear la base de datos en MongoDB Atlas (gratis)
1. Entra a https://www.mongodb.com/cloud/atlas y crea una cuenta.
2. Crea un cluster **Free (M0)**.
3. En **Database Access**, crea un usuario con contraseña.
4. En **Network Access**, agrega `0.0.0.0/0` (permite conectarse desde cualquier lugar).
5. En el cluster: **Connect → Drivers** y copia la dirección (`mongodb+srv://...`).

### 3. Crear la contraseña de aplicación de Gmail
1. Activa la **verificación en 2 pasos** en tu cuenta de Google.
2. Entra a https://myaccount.google.com/apppasswords, crea una (ej. "Portafolio") y copia las 16 letras.

### 4. Configurar el archivo de configuración
Llena `configuracion.env` (o copia `.env.example` como `.env`). El servidor lee cualquiera de los dos:

```
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/portafolio?retryWrites=true&w=majority
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=lasdieciseisletras
EMAIL_TO=tucorreo@gmail.com
```

> `configuracion.env` y `.env` tienen contraseñas: **nunca los subas a GitHub** (ya están en `.gitignore`).

### 5. Instalar y arrancar
En la terminal, dentro de la carpeta del proyecto:

```
npm install
npm start
```

Abre **http://localhost:3000**. Llena el formulario de contacto y revisa tu correo.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm start` | Arranca el portafolio en http://localhost:3000 |
| `npm run dev` | Igual, pero se reinicia solo cuando cambias el código |
| `npm run mensajes` | Muestra en la terminal los últimos 20 mensajes guardados |
| `npm run cargar-proyectos` | Copia los proyectos de `data.js` a MongoDB (actualiza y agrega) |

Para revisar que todo está conectado: http://localhost:3000/api/estado

También puedes verlos en MongoDB Atlas: **Browse Collections → portafolio → proyectos / contactos**.

## Publicarlo en internet (Render, gratis)
1. Sube el proyecto a un repositorio de GitHub (sin `.env` ni `node_modules`).
2. En https://render.com crea un **Web Service** conectado a ese repositorio.
3. Build command: `npm install` · Start command: `npm start`.
4. En **Environment** agrega `MONGODB_URI`, `EMAIL_TO` y `RESEND_API_KEY` (ver abajo).
5. Render te da un link (`https://...onrender.com`) con la página y el formulario funcionando.

**Importante sobre el correo en Render:** el plan gratis de Render bloquea los puertos de correo SMTP, así que Gmail no envía desde allá (en tu computador sí funciona). Para Render usa **Resend**, que envía por HTTPS:
1. Crea una cuenta gratis en https://resend.com **con el mismo correo donde quieres recibir los avisos** (`EMAIL_TO`).
2. En **API Keys** crea una clave y ponla en Render como `RESEND_API_KEY`.
3. Listo: si `RESEND_API_KEY` está llena, el servidor la usa en vez de Gmail.

**Si prefieres la página en GitHub Pages:** publica la carpeta `public/` en GitHub Pages y el servidor en Render. Luego en `public/js/main.js` cambia `API_CONTACTO` por `https://tu-servidor.onrender.com/api/contacto`, y en Render pon `ORIGENES_PERMITIDOS=https://tu-usuario.github.io`.

## Tecnologías
HTML, CSS, JavaScript · Node.js, Express · MongoDB Atlas, Mongoose · Nodemailer / Resend · express-rate-limit · dotenv

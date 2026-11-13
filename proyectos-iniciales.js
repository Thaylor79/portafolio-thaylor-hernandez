/* Lee los proyectos de public/js/data.js para cargarlos en MongoDB */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function leerProyectos() {
  const codigo = fs.readFileSync(path.join(__dirname, "public", "js", "data.js"), "utf8");
  const contexto = {};
  vm.runInNewContext(codigo + "\nthis.PROJECTS = PROJECTS;", contexto);
  return contexto.PROJECTS.map((p, i) => ({ ...p, orden: i + 1 }));
}

module.exports = { leerProyectos };

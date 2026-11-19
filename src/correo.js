// Reglas de negocio para generar el correo corporativo.
const fs = require('fs');

const DOMINIO = '@democompany.com';

// Tratamientos y sufijos que no se consideran parte del nombre
const TRATAMIENTOS = ['mr', 'mrs', 'ms', 'miss', 'dr', 'sr', 'sra', 'srta'];
const SUFIJOS = ['jr', 'sr', 'i', 'ii', 'iii', 'iv', 'v', 'md', 'dds', 'phd'];

// Lee cuentas_existentes.csv y devuelve un Set con los nombres de usuario ocupados
function cargarCuentasExistentes(rutaCsv) {
  const lineas = fs.readFileSync(rutaCsv, 'utf8').split(/\r?\n/).slice(1); // se omite el encabezado
  const usados = new Set();
  for (const linea of lineas) {
    const correo = linea.trim().toLowerCase();
    if (correo) usados.add(correo.split('@')[0]);
  }
  return usados;
}

// "Mrs. Dennis Schulist" -> ["dennis", "schulist"]
function limpiarNombre(nombreCompleto) {
  const palabras = nombreCompleto
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita tildes: "José" -> "Jose"
    .toLowerCase()
    .split(/\s+/)
    .map((p) => p.replace(/[^a-z]/g, '')) // quita puntos, apóstrofes, etc.
    .filter(Boolean);

  if (TRATAMIENTOS.includes(palabras[0])) palabras.shift();
  if (palabras.length > 2 && SUFIJOS.includes(palabras[palabras.length - 1])) palabras.pop();
  return palabras;
}

// Genera un correo único y lo marca como usado
function generarCorreo(nombreCompleto, usados) {
  const palabras = limpiarNombre(nombreCompleto || '');
  if (palabras.length < 2) {
    throw new Error('el nombre no tiene nombre y apellido válidos');
  }

  const base = palabras[0][0] + palabras[palabras.length - 1]; // primera letra + apellido
  let usuario = base;
  let numero = 1;
  while (usados.has(usuario)) {
    usuario = base + numero; // jdoe -> jdoe1 -> jdoe2 ...
    numero++;
  }

  usados.add(usuario); // para que no se repita dentro de la misma ejecución
  return usuario + DOMINIO;
}

module.exports = { cargarCuentasExistentes, limpiarNombre, generarCorreo };

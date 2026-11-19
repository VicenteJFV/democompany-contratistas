// Escribe una lista de objetos como archivo CSV.
const fs = require('fs');
const path = require('path');

const COLUMNAS = ['nombre_completo', 'telefono', 'correo_original', 'empresa', 'ciudad', 'correo_corporativo'];

// Encierra el valor entre comillas si contiene comas, comillas o saltos de línea
function escapar(valor) {
  const texto = String(valor ?? '');
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function escribirCsv(ruta, filas) {
  const lineas = [COLUMNAS.join(',')];
  for (const fila of filas) {
    lineas.push(COLUMNAS.map((col) => escapar(fila[col])).join(','));
  }
  fs.mkdirSync(path.dirname(ruta), { recursive: true });
  fs.writeFileSync(ruta, lineas.join('\n') + '\n', 'utf8');
}

module.exports = { escribirCsv };

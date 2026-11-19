// Logger simple: escribe cada mensaje en consola y en logs/proceso.log.
// Importante: nunca se deben registrar teléfonos ni correos personales.
const fs = require('fs');
const path = require('path');

const ARCHIVO_LOG = path.join(__dirname, '..', 'logs', 'proceso.log');
fs.mkdirSync(path.dirname(ARCHIVO_LOG), { recursive: true });

function escribir(nivel, mensaje) {
  const linea = `${new Date().toISOString()} [${nivel}] ${mensaje}`;
  console.log(linea);
  fs.appendFileSync(ARCHIVO_LOG, linea + '\n');
}

module.exports = {
  info: (mensaje) => escribir('INFO', mensaje),
  warn: (mensaje) => escribir('WARN', mensaje),
  error: (mensaje) => escribir('ERROR', mensaje),
};

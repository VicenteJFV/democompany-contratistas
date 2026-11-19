// Obtiene la lista de contratistas desde el servicio web.
// Si el servicio falla, reintenta; si sigue fallando, lanza un error claro.
const fs = require('fs');
const logger = require('./logger');

const INTENTOS = 3;
const TIEMPO_MAXIMO_MS = 10000; // 10 segundos por intento

async function obtenerContratistas(origen) {
  // Permite usar un archivo local (útil si no hay conexión durante la demo)
  if (!origen.startsWith('http')) {
    logger.info(`Leyendo contratistas desde archivo local: ${origen}`);
    return validar(JSON.parse(fs.readFileSync(origen, 'utf8')));
  }

  for (let intento = 1; intento <= INTENTOS; intento++) {
    try {
      logger.info(`Conectando al servicio web (intento ${intento} de ${INTENTOS}): ${origen}`);
      const respuesta = await fetch(origen, { signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });
      if (!respuesta.ok) {
        throw new Error(`el servicio respondió con estado HTTP ${respuesta.status}`);
      }
      return validar(await respuesta.json());
    } catch (error) {
      logger.warn(`Fallo al obtener datos: ${error.message}`);
      if (intento === INTENTOS) {
        throw new Error(`No se pudo obtener la información del servicio web tras ${INTENTOS} intentos`);
      }
    }
  }
}

function validar(datos) {
  if (!Array.isArray(datos)) {
    throw new Error('La respuesta no tiene el formato esperado (se esperaba una lista)');
  }
  return datos;
}

module.exports = { obtenerContratistas };

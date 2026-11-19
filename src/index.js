// Punto de entrada: orquesta el proceso completo, paso a paso.
const path = require('path');
const logger = require('./logger');
const { obtenerContratistas } = require('./servicio');
const { cargarCuentasExistentes, generarCorreo } = require('./correo');
const { escribirCsv } = require('./csv');

// Configuración (se puede cambiar sin tocar el resto del código)
const URL_SERVICIO = 'https://jsonplaceholder.typicode.com/users';
const ARCHIVO_CUENTAS = path.join(__dirname, '..', 'datos', 'cuentas_existentes.csv');
const ARCHIVO_SALIDA = path.join(__dirname, '..', 'salida', 'contratistas_correos.csv');

async function main() {
  logger.info('Inicio del proceso');

  // 1. Obtener los contratistas (del servicio web o de un archivo pasado como argumento)
  const origen = process.argv[2] || URL_SERVICIO;
  const contratistas = await obtenerContratistas(origen);
  logger.info(`Total de registros obtenidos: ${contratistas.length}`);

  // 2. Cargar los correos que ya existen en DemoCompany
  const usados = cargarCuentasExistentes(ARCHIVO_CUENTAS);
  logger.info(`Cuentas existentes cargadas: ${usados.size}`);

  // 3. Generar el correo corporativo de cada contratista
  const filas = [];
  for (const c of contratistas) {
    try {
      const correoCorporativo = generarCorreo(c.name, usados);
      filas.push({
        nombre_completo: c.name,
        telefono: c.phone,
        correo_original: c.email,
        empresa: c.company?.name,
        ciudad: c.address?.city,
        correo_corporativo: correoCorporativo,
      });
      logger.info(`Registro id=${c.id} procesado -> ${correoCorporativo}`);
    } catch (error) {
      // Un registro con problemas no detiene el proceso completo
      logger.warn(`Registro id=${c.id} omitido: ${error.message}`);
    }
  }
  logger.info(`Total de registros procesados: ${filas.length} de ${contratistas.length}`);

  // 4. Escribir el CSV de salida
  escribirCsv(ARCHIVO_SALIDA, filas);
  logger.info(`Archivo generado correctamente: ${ARCHIVO_SALIDA}`);
  logger.info('Fin del proceso');
}

main().catch((error) => {
  logger.error(`El proceso terminó con error: ${error.message}`);
  process.exitCode = 1;
});

# DemoCompany – Correos corporativos para contratistas

Aplicación en Node.js que obtiene los contratistas desde un servicio web y genera un correo corporativo único `@democompany.com` para cada uno. El resultado queda en un CSV y el proceso se registra en un log.

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo).
- No necesita dependencias externas, así que no hay que ejecutar `npm install`.

## Cómo ejecutar

```bash
npm start
```

Si el servicio web no estuviera disponible, se puede ejecutar con el archivo JSON de respaldo:

```bash
node src/index.js datos/contratistas_respaldo.json
```

Para ejecutar las pruebas:

```bash
npm test
```

## Resultados

| Archivo | Contenido |
| --- | --- |
| `salida/contratistas_correos.csv` | Nombre completo, teléfono, correo original, empresa, ciudad y correo corporativo |
| `logs/proceso.log` | Inicio, total obtenido, total procesado y confirmación del archivo |

## Estructura

```
src/
  index.js      Orquesta el proceso paso a paso
  servicio.js   Conexión al servicio web (timeout de 10 s y 3 reintentos)
  correo.js     Reglas para generar el correo corporativo
  csv.js        Escritura del CSV de salida
  logger.js     Log a consola y archivo
datos/
  cuentas_existentes.csv       Correos ya asignados en DemoCompany
  contratistas_respaldo.json   Copia de los datos para usar sin conexión
test/
  correo.test.js               Pruebas de las reglas de negocio
```

## Reglas aplicadas

- Usuario = primera letra del nombre + apellido, en minúsculas (John Doe → `jdoe`).
- Se ignoran tratamientos (Mr., Mrs., Ms., Dr.) y sufijos (Jr., Sr., II, III, V, etc.).
- Se quitan tildes y caracteres no alfabéticos.
- Si el usuario ya existe en `cuentas_existentes.csv` o se generó antes en la misma ejecución, se agrega un correlativo: `jdoe1`, `jdoe2`, etc.

## Manejo de errores

- Si el servicio web no responde, se reintenta 3 veces con un timeout de 10 s cada vez. Si sigue fallando, se registra el error y el proceso termina con código 1.
- Se valida que la respuesta sea una lista.
- Si un registro no tiene un nombre válido, se omite y queda una advertencia en el log, sin detener el resto del proceso.
- El log no incluye teléfonos ni correos personales: solo el id del registro y el correo corporativo generado.

## Herramientas de apoyo

- Node.js 22 y el test runner nativo (`node:test`).
- Claude (asistente de IA) como apoyo en el diseño y la redacción del código.

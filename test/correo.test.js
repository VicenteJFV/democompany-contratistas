// Pruebas de las reglas de generación de correo. Ejecutar con: npm test
const test = require('node:test');
const assert = require('node:assert');
const { generarCorreo } = require('../src/correo');

test('primera letra del nombre + apellido, en minúsculas', () => {
  assert.strictEqual(generarCorreo('John Doe', new Set()), 'jdoe@democompany.com');
});

test('ignora tratamientos y sufijos', () => {
  assert.strictEqual(generarCorreo('Mrs. Dennis Schulist', new Set()), 'dschulist@democompany.com');
  assert.strictEqual(generarCorreo('Nicholas Runolfsdottir V', new Set()), 'nrunolfsdottir@democompany.com');
});

test('agrega correlativo si el usuario ya existe', () => {
  const usados = new Set(['jdoe', 'jdoe1']);
  assert.strictEqual(generarCorreo('John Doe', usados), 'jdoe2@democompany.com');
});

test('no repite correos generados en la misma ejecución', () => {
  const usados = new Set();
  assert.strictEqual(generarCorreo('John Doe', usados), 'jdoe@democompany.com');
  assert.strictEqual(generarCorreo('Jane Doe', usados), 'jdoe1@democompany.com');
});

test('quita tildes', () => {
  assert.strictEqual(generarCorreo('José Núñez', new Set()), 'jnunez@democompany.com');
});

test('rechaza nombres sin apellido', () => {
  assert.throws(() => generarCorreo('Madonna', new Set()));
});

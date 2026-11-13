import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import test from 'node:test'
import { CLAVE_CUENTAS, crearServicioCuentas } from '../src/utils/cuentas.js'
import { validarCampo, validarFormulario } from '../src/utils/validaciones.js'

const datos = { nombre: 'Lucas Prueba', email: 'lucas@example.test', repetirEmail: 'lucas@example.test', password: 'Cafe-prueba-2026', repetirPassword: 'Cafe-prueba-2026', telefono: '3511234567' }

function preparar() {
  const valores = new Map()
  const storage = {
    getItem: (clave) => valores.get(clave) ?? null,
    setItem: (clave, valor) => valores.set(clave, valor),
  }
  const crear = () => crearServicioCuentas({ obtenerStorage: () => storage, crypto: webcrypto })
  return { valores, storage, crear, servicio: crear() }
}

test('registra y restaura la sesión sin guardar contraseñas en texto', async () => {
  const { servicio, crear, valores } = preparar()
  const usuario = await servicio.registrar({ ...datos, nombre: '  Lucas Prueba  ', email: ' LUCAS@example.test ' })
  assert.deepEqual(usuario, { nombre: datos.nombre, email: datos.email, telefono: datos.telefono })
  assert.deepEqual(crear().obtenerSesion(), usuario)
  const guardado = valores.get(CLAVE_CUENTAS)
  assert.equal(guardado.includes(datos.password), false)
  assert.equal('passwordHash' in usuario, false)
})

test('cerrar sesión conserva la cuenta y permite volver a ingresar', async () => {
  const { servicio, crear } = preparar()
  const usuario = await servicio.registrar(datos)
  await servicio.cerrarSesion()
  assert.equal(crear().obtenerSesion(), null)
  assert.deepEqual(await crear().iniciarSesion({ email: ' LUCAS@example.test ', password: datos.password }), usuario)
  assert.deepEqual(crear().obtenerSesion(), usuario)
})

test('rechaza contraseña incorrecta y correo inexistente sin abrir sesión', async () => {
  const { servicio } = preparar()
  await servicio.registrar(datos)
  await servicio.cerrarSesion()
  await assert.rejects(servicio.iniciarSesion({ ...datos, password: 'otra-contraseña' }), { codigo: 'credenciales' })
  await assert.rejects(servicio.iniciarSesion({ ...datos, email: 'otra@example.test' }), { codigo: 'credenciales' })
  assert.equal(servicio.obtenerSesion(), null)
})

test('rechaza correos repetidos, incluidas mayúsculas y espacios', async () => {
  const { servicio, valores } = preparar()
  await servicio.registrar(datos)
  const original = valores.get(CLAVE_CUENTAS)
  await assert.rejects(servicio.registrar({ ...datos, email: ' LUCAS@example.test ' }), { codigo: 'duplicado' })
  assert.equal(valores.get(CLAVE_CUENTAS), original)
})

test('dos registros simultáneos no duplican la misma cuenta', async () => {
  const { servicio, valores } = preparar()
  const resultados = await Promise.allSettled([servicio.registrar(datos), servicio.registrar(datos)])
  assert.equal(resultados.filter((resultado) => resultado.status === 'fulfilled').length, 1)
  assert.equal(JSON.parse(valores.get(CLAVE_CUENTAS)).cuentas.length, 1)
})

test('conserva varias cuentas y usa una sal diferente para cada contraseña', async () => {
  const { servicio, valores } = preparar()
  await Promise.all([servicio.registrar(datos), servicio.registrar({ ...datos, email: 'segunda@example.test' })])
  const { cuentas } = JSON.parse(valores.get(CLAVE_CUENTAS))
  assert.equal(cuentas.length, 2)
  assert.notEqual(cuentas[0].salt, cuentas[1].salt)
  assert.notEqual(cuentas[0].passwordHash, cuentas[1].passwordHash)
  await servicio.cerrarSesion()
  assert.equal((await servicio.iniciarSesion(datos)).email, datos.email)
})

test('los datos de la versión anterior permiten completar el registro, sin fingir una sesión', async () => {
  const { servicio, valores } = preparar()
  valores.set('cafe-loop-usuario', JSON.stringify({ nombre: datos.nombre, email: datos.email }))
  assert.equal(servicio.obtenerSesion(), null)
  assert.deepEqual(servicio.obtenerPerfilAnterior(), { nombre: datos.nombre, email: datos.email })
  await assert.rejects(servicio.iniciarSesion(datos), { codigo: 'credenciales' })
  await servicio.registrar(datos)
  assert.equal(servicio.obtenerPerfilAnterior(), null)
})

test('los datos dañados muestran un error y no se sobrescriben', async () => {
  const { servicio, valores } = preparar()
  for (const contenido of ['{incompleto', 'null', '{"version":1,"cuentas":[{}],"emailSesion":null}']) {
    valores.set(CLAVE_CUENTAS, contenido)
    assert.throws(() => servicio.obtenerSesion(), { codigo: 'datos' })
    await assert.rejects(servicio.registrar(datos), { codigo: 'datos' })
    assert.equal(valores.get(CLAVE_CUENTAS), contenido)
  }
})

test('un bloqueo de almacenamiento no deja cuentas o sesiones a medio guardar', async () => {
  const { servicio, storage, valores } = preparar()
  storage.setItem = () => { throw new Error('QuotaExceededError') }
  await assert.rejects(servicio.registrar(datos), { codigo: 'almacenamiento' })
  assert.equal(valores.has(CLAVE_CUENTAS), false)
  assert.equal(servicio.obtenerSesion(), null)
  const bloqueado = crearServicioCuentas({ obtenerStorage: () => { throw new Error('SecurityError') } })
  assert.throws(() => bloqueado.obtenerSesion(), { codigo: 'almacenamiento' })
})

test('avisa si el navegador no puede proteger la contraseña', async () => {
  const { storage } = preparar()
  const servicio = crearServicioCuentas({ obtenerStorage: () => storage, crypto: {} })
  await assert.rejects(servicio.registrar(datos), { codigo: 'crypto' })
  assert.equal(servicio.obtenerSesion(), null)
})

test('valida contraseñas y campos repetidos mientras se escriben', () => {
  assert.equal(Object.values(validarFormulario(datos, true)).some(Boolean), false)
  assert.notEqual(validarCampo('password', 'abc', datos, true), '')
  assert.notEqual(validarCampo('password', '      ', datos, true), '')
  assert.equal(validarCampo('repetirEmail', ' LUCAS@example.test ', datos, true), '')
  assert.notEqual(validarCampo('repetirPassword', datos.repetirPassword, { ...datos, password: 'cambiada' }, true), '')
  assert.notEqual(validarCampo('repetirEmail', datos.repetirEmail, { ...datos, email: 'otra@example.test' }, true), '')
  assert.equal(Object.values(validarFormulario({ email: datos.email, password: datos.password }, false)).some(Boolean), false)
})

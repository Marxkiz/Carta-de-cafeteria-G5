export const CLAVE_CUENTAS = 'cafe-loop-cuentas'
const ITERACIONES = 600000

export class ErrorCuenta extends Error {
  constructor(mensaje, codigo) {
    super(mensaje)
    this.name = 'ErrorCuenta'
    this.codigo = codigo
  }
}

const normalizarEmail = (email) => email.trim().toLowerCase()
const perfil = ({ nombre, email, telefono }) => ({ nombre, email, telefono })
const aHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

// Cuenta de demostración local. No reemplaza la autenticación de un servidor.
export function crearServicioCuentas({ obtenerStorage = () => localStorage, crypto = globalThis.crypto } = {}) {
  function usarStorage(operacion) {
    try {
      return operacion(obtenerStorage())
    } catch {
      throw new ErrorCuenta('No pudimos acceder a tus datos. Permití que este sitio guarde datos en el navegador y volvé a intentar.', 'almacenamiento')
    }
  }

  function leerEstado() {
    const guardado = usarStorage((storage) => storage.getItem(CLAVE_CUENTAS))
    if (!guardado) return { version: 1, cuentas: [], emailSesion: null }
    try {
      const estado = JSON.parse(guardado)
      const valido = estado?.version === 1 && Array.isArray(estado.cuentas)
        && (estado.emailSesion === null || typeof estado.emailSesion === 'string')
        && estado.cuentas.every((cuenta) => cuenta
          && typeof cuenta.nombre === 'string' && typeof cuenta.email === 'string'
          && typeof cuenta.telefono === 'string' && /^[a-f0-9]{32}$/.test(cuenta.salt)
          && /^[a-f0-9]{64}$/.test(cuenta.passwordHash) && cuenta.iteraciones === ITERACIONES)
      if (!valido) throw new Error('Formato inválido')
      return estado
    } catch {
      throw new ErrorCuenta('No pudimos leer las cuentas guardadas en este navegador. Tus datos se conservaron sin cambios.', 'datos')
    }
  }

  function guardarEstado(estado) {
    usarStorage((storage) => storage.setItem(CLAVE_CUENTAS, JSON.stringify(estado)))
  }

  // Serializa las escrituras entre pestañas cuando el navegador ofrece Web Locks.
  function actualizar(tarea) {
    return globalThis.navigator?.locks
      ? navigator.locks.request(CLAVE_CUENTAS, async () => tarea())
      : Promise.resolve().then(tarea)
  }

  async function derivarPassword(password, salt) {
    if (!crypto?.subtle || !crypto?.getRandomValues) {
      throw new ErrorCuenta('No se pudo proteger la contraseña. Abrí el sitio mediante HTTPS o localhost.', 'crypto')
    }
    const clave = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    const bytes = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITERACIONES, hash: 'SHA-256' }, clave, 256)
    return aHex(new Uint8Array(bytes))
  }

  function obtenerSesion() {
    const estado = leerEstado()
    const cuenta = estado.cuentas.find((item) => item.email === estado.emailSesion)
    return cuenta ? perfil(cuenta) : null
  }

  function obtenerPerfilAnterior() {
    const estado = leerEstado()
    const anterior = usarStorage((storage) => storage.getItem('cafe-loop-usuario'))
    try {
      const datos = JSON.parse(anterior)
      if (typeof datos?.nombre !== 'string' || typeof datos?.email !== 'string') return null
      const email = normalizarEmail(datos.email)
      if (estado.cuentas.some((cuenta) => cuenta.email === email)) return null
      return { nombre: datos.nombre, email }
    } catch {
      return null
    }
  }

  async function registrar({ nombre, email, password, telefono }) {
    email = normalizarEmail(email)
    const comprobarDuplicado = (estado) => {
      if (estado.cuentas.some((cuenta) => cuenta.email === email)) {
        throw new ErrorCuenta('Ya existe una cuenta con ese correo en este navegador. Elegí «Ya tengo una cuenta» para ingresar.', 'duplicado')
      }
    }
    comprobarDuplicado(leerEstado())
    if (!crypto?.getRandomValues) {
      throw new ErrorCuenta('No se pudo proteger la contraseña. Abrí el sitio mediante HTTPS o localhost.', 'crypto')
    }
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const passwordHash = await derivarPassword(password, salt)
    const cuenta = { nombre: nombre.trim(), email, telefono: telefono.trim(), salt: aHex(salt), passwordHash, iteraciones: ITERACIONES }
    return actualizar(() => {
      const estado = leerEstado()
      comprobarDuplicado(estado)
      guardarEstado({ ...estado, cuentas: [...estado.cuentas, cuenta], emailSesion: email })
      return perfil(cuenta)
    })
  }

  async function iniciarSesion({ email, password }) {
    email = normalizarEmail(email)
    const cuenta = leerEstado().cuentas.find((item) => item.email === email)
    const errorCredenciales = () => new ErrorCuenta('El correo o la contraseña no coinciden. Si todavía no creaste una cuenta en este navegador, elegí «Quiero registrarme».', 'credenciales')
    if (!cuenta) throw errorCredenciales()
    const salt = Uint8Array.from(cuenta.salt.match(/.{2}/g), (byte) => parseInt(byte, 16))
    const passwordHash = await derivarPassword(password, salt)
    if (passwordHash !== cuenta.passwordHash) throw errorCredenciales()
    return actualizar(() => {
      const estado = leerEstado()
      if (!estado.cuentas.some((item) => item.email === email && item.passwordHash === passwordHash)) throw errorCredenciales()
      guardarEstado({ ...estado, emailSesion: email })
      return perfil(cuenta)
    })
  }

  async function cerrarSesion() {
    return actualizar(() => guardarEstado({ ...leerEstado(), emailSesion: null }))
  }

  return { obtenerSesion, obtenerPerfilAnterior, registrar, iniciarSesion, cerrarSesion }
}

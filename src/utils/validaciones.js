export function validarCampo(nombre, valor, datos, esRegistro) {
  const limpio = valor.trim()

  if (nombre === 'nombre' && esRegistro && limpio.length < 2) return 'Ingresá al menos dos caracteres.'
  if (nombre === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return 'Ingresá un correo válido.'
  if (nombre === 'repetirEmail' && esRegistro && limpio !== datos.email.trim()) return 'Los correos no coinciden.'
  if (nombre === 'password' && valor.length < 6) return 'La contraseña debe tener al menos seis caracteres.'
  if (nombre === 'repetirPassword' && esRegistro && valor !== datos.password) return 'Las contraseñas no coinciden.'
  if (nombre === 'telefono' && esRegistro && !/^\d{8,15}$/.test(limpio)) return 'Ingresá entre 8 y 15 números.'
  return ''
}

export function validarFormulario(datos, esRegistro) {
  const campos = esRegistro
    ? ['nombre', 'email', 'repetirEmail', 'password', 'repetirPassword', 'telefono']
    : ['email', 'password']

  return Object.fromEntries(campos.map((campo) => [campo, validarCampo(campo, datos[campo], datos, esRegistro)]))
}

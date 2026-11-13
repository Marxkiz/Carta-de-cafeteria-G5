import { createContext, useContext, useEffect, useState } from 'react'
import { CLAVE_CUENTAS, crearServicioCuentas } from '@/utils/cuentas.js'

const SesionContext = createContext(null)
const servicio = crearServicioCuentas()

function leerSesion() {
  try {
    return { usuario: servicio.obtenerSesion(), perfilAnterior: servicio.obtenerPerfilAnterior(), error: '' }
  } catch (error) {
    return { usuario: null, perfilAnterior: null, error: error.message }
  }
}

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  useEffect(() => {
    function sincronizar(event) {
      if (event.key === CLAVE_CUENTAS || event.key === null) setSesion(leerSesion())
    }
    window.addEventListener('storage', sincronizar)
    return () => window.removeEventListener('storage', sincronizar)
  }, [])

  async function registrar(datos) {
    const usuario = await servicio.registrar(datos)
    setSesion({ usuario, perfilAnterior: null, error: '' })
  }

  async function iniciarSesion(datos) {
    const usuario = await servicio.iniciarSesion(datos)
    setSesion({ usuario, perfilAnterior: null, error: '' })
  }

  async function cerrarSesion() {
    await servicio.cerrarSesion()
    setSesion({ usuario: null, perfilAnterior: null, error: '' })
  }

  return <SesionContext.Provider value={{ ...sesion, registrar, iniciarSesion, cerrarSesion }}>{children}</SesionContext.Provider>
}

export function useSesion() {
  return useContext(SesionContext)
}

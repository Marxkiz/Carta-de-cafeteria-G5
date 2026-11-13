import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import db from '@/data/db.json'
import { addCartItem, apiDisponible, deleteCartItem, getCart, getProducts, updateCartItem } from '@/api/cafeteriaApi.js'

const CafeteriaContext = createContext()

function leerCarritoLocal() {
  try {
    const guardado = JSON.parse(localStorage.getItem('cafe-loop-carrito'))
    if (!Array.isArray(guardado)) return []
    return guardado.filter((item) => item && item.id != null && typeof item.productId === 'string'
      && typeof item.nombre === 'string' && typeof item.imagen === 'string'
      && Number.isFinite(item.precio) && item.precio >= 0
      && Number.isInteger(item.cantidad) && item.cantidad > 0)
  } catch {
    return []
  }
}

function leerCambiosPendientes(carrito) {
  try {
    const guardado = localStorage.getItem('cafe-loop-carrito-pendiente')
    if (guardado !== null) return guardado === 'true'
    return carrito.some((item) => String(item.id).startsWith('local-'))
  } catch {
    return false
  }
}

export function CafeteriaProvider({ children }) {
  const [productos, setProductos] = useState(db.products)
  const [carrito, setCarrito] = useState(leerCarritoLocal)
  const [cargando, setCargando] = useState(apiDisponible)
  const [errorApi, setErrorApi] = useState(apiDisponible ? '' : 'Tu carrito se guarda en este dispositivo.')
  const carritoRef = useRef(carrito)
  const pendienteRef = useRef(leerCambiosPendientes(carrito))
  const revisionRef = useRef(0)
  const operacionesRef = useRef(Promise.resolve())

  function guardarCarrito(items, pendiente) {
    carritoRef.current = items
    pendienteRef.current = pendiente
    setCarrito(items)
    try {
      localStorage.setItem('cafe-loop-carrito', JSON.stringify(items))
      localStorage.setItem('cafe-loop-carrito-pendiente', String(pendiente))
    } catch {
      setErrorApi('El navegador no pudo guardar el carrito. Conservá esta pestaña abierta para mantener tu pedido.')
    }
  }

  async function sincronizarCarrito() {
    const revision = revisionRef.current
    const items = carritoRef.current
    const remotos = await getCart()

    // Cada intento consulta el servidor para poder continuar después de un fallo parcial.
    for (const remoto of remotos) {
      if (!items.some((item) => String(item.id) === String(remoto.id))) {
        await deleteCartItem(remoto.id)
      }
    }
    for (const item of items) {
      const remoto = remotos.find((guardado) => String(guardado.id) === String(item.id))
      if (!remoto) {
        await addCartItem(item)
      } else if (remoto.cantidad !== item.cantidad) {
        await updateCartItem(item.id, { cantidad: item.cantidad })
      }
    }
    if (revision === revisionRef.current) {
      setErrorApi('')
      guardarCarrito(items, false)
    }
  }

  function modificarCarrito(actualizar) {
    revisionRef.current += 1
    guardarCarrito(actualizar(carritoRef.current), true)
    if (!apiDisponible) return Promise.resolve()

    // Las operaciones mantienen su orden aunque se pulse varias veces rápidamente.
    operacionesRef.current = operacionesRef.current.then(async () => {
      try {
        await sincronizarCarrito()
      } catch {
        setErrorApi('El carrito se guardó en este dispositivo. Se volverá a sincronizar al modificarlo o recargar cuando la API esté disponible.')
      }
    })
    return operacionesRef.current
  }

  useEffect(() => {
    if (!apiDisponible) return
    let activo = true

    async function cargarDatos() {
      if (!activo) return
      try {
        const [productosApi, carritoApi] = await Promise.all([getProducts(), getCart()])
        if (!activo) return
        setProductos(productosApi)
        if (pendienteRef.current) {
          await sincronizarCarrito()
        } else {
          setErrorApi('')
          guardarCarrito(carritoApi, false)
        }
      } catch {
        if (!activo) return
        setProductos(db.products)
        setErrorApi('La API no está disponible. Se están usando los datos guardados en la aplicación.')
      } finally {
        if (activo) setCargando(false)
      }
    }
    operacionesRef.current = operacionesRef.current.then(cargarDatos)
    return () => { activo = false }
  }, [])

  function agregarAlCarrito(producto) {
    return modificarCarrito((actual) => {
      const existente = actual.find((item) => item.productId === producto.id)
      if (existente) {
        return actual.map((item) => item.productId === producto.id
          ? { ...item, cantidad: item.cantidad + 1 } : item)
      }
      return [...actual, {
        id: `local-${producto.id}`,
        productId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
      }]
    })
  }

  function cambiarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad < 1) return eliminarDelCarrito(id)
    return modificarCarrito((actual) => actual.map((item) => item.id === id
      ? { ...item, cantidad: nuevaCantidad } : item))
  }

  function eliminarDelCarrito(id) {
    return modificarCarrito((actual) => actual.filter((item) => item.id !== id))
  }

  function vaciarCarrito() {
    return modificarCarrito(() => [])
  }

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0)
  const precioTotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
  const value = useMemo(() => ({ productos, carrito, cargando, errorApi, cantidadTotal, precioTotal, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito }), [productos, carrito, cargando, errorApi, cantidadTotal, precioTotal])

  return <CafeteriaContext.Provider value={value}>{children}</CafeteriaContext.Provider>
}

export function useCafeteria() {
  return useContext(CafeteriaContext)
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import db from '@/data/db.json'
import { addCartItem, deleteCartItem, getCart, getProducts, updateCartItem } from '@/api/cafeteriaApi.js'

const CafeteriaContext = createContext()

function leerCarritoLocal() {
  try {
    return JSON.parse(localStorage.getItem('cafe-loop-carrito')) || []
  } catch {
    return []
  }
}

export function CafeteriaProvider({ children }) {
  const [productos, setProductos] = useState(db.products)
  const [carrito, setCarrito] = useState(leerCarritoLocal)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [productosApi, carritoApi] = await Promise.all([getProducts(), getCart()])
        setProductos(productosApi)
        if (carritoApi.length > 0) setCarrito(carritoApi)
      } catch {
        setProductos(db.products)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  useEffect(() => {
    localStorage.setItem('cafe-loop-carrito', JSON.stringify(carrito))
  }, [carrito])

  async function agregarAlCarrito(producto) {
    const existente = carrito.find((item) => item.productId === producto.id)
    if (existente) {
      const cantidad = existente.cantidad + 1
      setCarrito((actual) => actual.map((item) => item.productId === producto.id ? { ...item, cantidad } : item))
      try {
        await updateCartItem(existente.id, { cantidad })
      } catch {
        return
      }
      return
    }
    const nuevoItem = {
      id: `local-${producto.id}`,
      productId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    }
    setCarrito((actual) => [...actual, nuevoItem])
    const { id, ...itemParaApi } = nuevoItem
    try {
      const creado = await addCartItem(itemParaApi)
      setCarrito((actual) => actual.map((item) => item.id === id ? { ...item, id: creado.id } : item))
    } catch {
      return
    }
  }

  async function cambiarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(id)
      return
    }
    setCarrito((actual) => actual.map((item) => item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    try {
      await updateCartItem(id, { cantidad: nuevaCantidad })
    } catch {
      return
    }
  }

  async function eliminarDelCarrito(id) {
    setCarrito((actual) => actual.filter((item) => item.id !== id))
    try {
      await deleteCartItem(id)
    } catch {
      return
    }
  }

  async function vaciarCarrito() {
    const items = [...carrito]
    setCarrito([])
    await Promise.allSettled(items.map((item) => deleteCartItem(item.id)))
  }

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0)
  const precioTotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
  const value = useMemo(() => ({ productos, carrito, cargando, cantidadTotal, precioTotal, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito }), [productos, carrito, cargando, cantidadTotal, precioTotal])

  return <CafeteriaContext.Provider value={value}>{children}</CafeteriaContext.Provider>
}

export function useCafeteria() {
  return useContext(CafeteriaContext)
}

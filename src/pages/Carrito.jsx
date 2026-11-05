import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCafeteria } from '@/context/CafeteriaContext.jsx'
import { formatearPrecio } from '@/utils/formato.js'

function Carrito() {
  const { carrito, precioTotal, cambiarCantidad, eliminarDelCarrito, vaciarCarrito } = useCafeteria()
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  async function finalizarCompra() {
    await vaciarCarrito()
    setMensaje('Compra finalizada')
  }

  return (
    <section className="cart-page section-space">
      <div className="container cart-container">
        <header className="page-header">
          <p className="eyebrow dark">TU PEDIDO</p>
          <h1>Carrito</h1>
        </header>
        {mensaje && (
          <div className="purchase-complete" role="status">
            <div className="alert purchase-message">{mensaje}</div>
            <button className="btn btn-cafe" type="button" onClick={() => navigate('/menu')}>Volver al menú</button>
          </div>
        )}
        {carrito.length === 0 && !mensaje && (
          <div className="empty-cart">
            <h2>Tu carrito está vacío</h2>
            <p>Elegí algo rico del menú para empezar.</p>
            <Link className="btn btn-cafe" to="/menu">Ir al menú</Link>
          </div>
        )}
        {carrito.length > 0 && (
          <div className="cart-layout">
            <div className="cart-items">
              {carrito.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="cart-item-info">
                    <h2>{item.nombre}</h2>
                    <p>{formatearPrecio(item.precio)} cada uno</p>
                    <div className="quantity-control" aria-label={`Cantidad de ${item.nombre}`}>
                      <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} aria-label="Restar uno">−</button>
                      <span>{item.cantidad}</span>
                      <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} aria-label="Sumar uno">+</button>
                    </div>
                  </div>
                  <div className="cart-item-end">
                    <strong>{formatearPrecio(item.precio * item.cantidad)}</strong>
                    <button className="remove-button" type="button" onClick={() => eliminarDelCarrito(item.id)}>Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Resumen</h2>
              <div><span>Total</span><strong>{formatearPrecio(precioTotal)}</strong></div>
              <button className="btn btn-cafe btn-lg w-100" type="button" onClick={finalizarCompra}>Finalizar compra</button>
              <p>No hace falta completar datos.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

export default Carrito

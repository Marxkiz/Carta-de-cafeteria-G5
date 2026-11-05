import { useCafeteria } from '@/context/CafeteriaContext.jsx'
import { formatearPrecio } from '@/utils/formato.js'

function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCafeteria()

  return (
    <article className="card product-card h-100">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
      <div className="card-body d-flex flex-column">
        <span className="product-category">{producto.categoria}</span>
        <h3 className="card-title">{producto.nombre}</h3>
        <p className="card-text">{producto.descripcion}</p>
        <div className="product-actions mt-auto">
          <strong>{formatearPrecio(producto.precio)}</strong>
          <button className="btn btn-cafe" type="button" onClick={() => agregarAlCarrito(producto)}>Agregar</button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

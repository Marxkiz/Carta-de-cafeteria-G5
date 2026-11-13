import { useState } from 'react'
import ProductCard from '@/components/ProductCard.jsx'
import { useCafeteria } from '@/context/CafeteriaContext.jsx'

const filtros = [
  { valor: 'Todos', texto: 'Todos' },
  { valor: 'Café', texto: 'Café en grano' },
  { valor: 'Accesorios', texto: 'Accesorios' },
  { valor: 'Objetos', texto: 'Objetos' },
]

function Tienda() {
  const { productos, cargando, errorApi } = useCafeteria()
  const [filtro, setFiltro] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const productosTienda = productos.filter((producto) => {
    const esTienda = producto.categoria === 'Tienda'
    const coincideFiltro = filtro === 'Todos' || producto.subcategoria === filtro
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return esTienda && coincideFiltro && coincideBusqueda
  })

  return (
    <section className="store-page section-space">
      <div className="container">
        <header className="page-header">
          <p className="eyebrow dark">CAFÉ LOOP EN CASA</p>
          <h1>La tienda</h1>
          <p>Los 12 productos de la tienda original, con sus imágenes y categorías.</p>
        </header>
        {errorApi && <p className="api-message" role="status">{errorApi}</p>}
        <div className="menu-tools">
          <label className="search-field">
            <span>Buscar</span>
            <input className="form-control" type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Ejemplo: molinillo" />
          </label>
          <div className="category-buttons" aria-label="Filtrar productos de la tienda">
            {filtros.map((opcion) => (
              <button className={`btn ${filtro === opcion.valor ? 'btn-cafe' : 'btn-outline-cafe'}`} type="button" onClick={() => setFiltro(opcion.valor)} key={opcion.valor}>{opcion.texto}</button>
            ))}
          </div>
        </div>
        {cargando && <p className="status-message">Cargando tienda...</p>}
        {!cargando && productosTienda.length === 0 && <p className="status-message">No encontramos productos con esa búsqueda.</p>}
        <div className="row g-4">
          {productosTienda.map((producto) => (
            <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tienda

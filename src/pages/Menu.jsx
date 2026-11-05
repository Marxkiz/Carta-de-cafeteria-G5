import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { useCafeteria } from '../context/CafeteriaContext.jsx'

const categorias = ['Todos', 'Cafés', 'Pastelería', 'Salados', 'Tienda']

function Menu() {
  const { productos, cargando } = useCafeteria()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const filtrados = productos.filter((producto) => {
    const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (
    <section className="menu-page section-space">
      <div className="container">
        <header className="page-header">
          <p className="eyebrow dark">PREPARADO EN EL MOMENTO</p>
          <h1>Nuestro menú</h1>
          <p>Buscá un producto o filtrá por categoría.</p>
        </header>
        <div className="menu-tools">
          <label className="search-field">
            <span>Buscar</span>
            <input className="form-control" type="search" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Ejemplo: latte" />
          </label>
          <div className="category-buttons" aria-label="Filtrar productos">
            {categorias.map((opcion) => (
              <button className={`btn ${categoria === opcion ? 'btn-cafe' : 'btn-outline-cafe'}`} type="button" onClick={() => setCategoria(opcion)} key={opcion}>{opcion}</button>
            ))}
          </div>
        </div>
        {cargando && <p className="status-message">Cargando productos...</p>}
        {!cargando && filtrados.length === 0 && <p className="status-message">No encontramos productos con esa búsqueda.</p>}
        <div className="row g-4">
          {filtrados.map((producto) => (
            <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu

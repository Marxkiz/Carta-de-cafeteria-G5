import { useState } from 'react'
import ProductCard from '@/components/ProductCard.jsx'
import { useCafeteria } from '@/context/CafeteriaContext.jsx'

const categorias = ['Todos', 'Cafés', 'Pastelería', 'Salados']

const descripciones = {
  'Cafés': 'Cafés de especialidad e infusiones preparados en el momento.',
  'Pastelería': 'Tortas, panadería y algo dulce para acompañar.',
  'Salados': 'Opciones completas para desayunar, almorzar o merendar.',
}

function Menu() {
  const { productos, cargando, errorApi } = useCafeteria()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const productosMenu = productos.filter((producto) => producto.categoria !== 'Tienda')
  const filtrados = productosMenu.filter((producto) => {
    const coincideCategoria = categoria === 'Todos' || producto.categoria === categoria
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })
  const secciones = categoria === 'Todos'
    ? categorias.slice(1).map((nombre) => ({ nombre, productos: filtrados.filter((producto) => producto.categoria === nombre) }))
    : [{ nombre: categoria, productos: filtrados }]

  return (
    <section className="menu-page section-space">
      <div className="container">
        <header className="page-header">
          <p className="eyebrow dark">PREPARADO EN EL MOMENTO</p>
          <h1>Nuestro menú</h1>
          <p>Buscá un producto o filtrá por categoría.</p>
        </header>
        {errorApi && <p className="api-message" role="status">{errorApi}</p>}
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
        {!cargando && secciones.map((seccion) => (
          seccion.productos.length > 0 && (
            <section className="catalog-section" key={seccion.nombre}>
              <div className="catalog-heading">
                <h2>{seccion.nombre}</h2>
                <p>{descripciones[seccion.nombre]}</p>
              </div>
              <div className="row g-4">
                {seccion.productos.map((producto) => (
                  <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                    <ProductCard producto={producto} />
                  </div>
                ))}
              </div>
            </section>
          )
        ))}
      </div>
    </section>
  )
}

export default Menu

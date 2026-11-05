import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useCafeteria } from '../context/CafeteriaContext.jsx'

function Inicio() {
  const { productos } = useCafeteria()
  const destacados = productos.filter((producto) => producto.destacado).slice(0, 3)

  return (
    <>
      <section className="hero-section">
        <img src="/images/entrada/cafe-loop-bolsa.jpg" alt="Bolsa de café Café Loop" className="hero-image" />
        <div className="hero-shade"></div>
        <div className="container hero-content">
          <p className="eyebrow">CAFÉ DE ESPECIALIDAD · CÓRDOBA</p>
          <h1>Una pausa que vale la pena.</h1>
          <p>Café tostado artesanalmente, pastelería fresca y un lugar para quedarse.</p>
          <div className="d-flex flex-wrap gap-3">
            <Link className="btn btn-cafe btn-lg" to="/menu">Ver el menú</Link>
            <Link className="btn btn-outline-light btn-lg" to="/carrito">Ver carrito</Link>
          </div>
        </div>
      </section>
      <section className="section-space intro-section">
        <div className="container intro-grid">
          <div>
            <p className="eyebrow dark">NUESTRO RITUAL</p>
            <h2>Café rico, sin complicarlo.</h2>
            <p>Seleccionamos granos de origen, los tostamos en pequeños lotes y preparamos cada taza en el momento. La idea es simple: que puedas elegir rápido y disfrutar sin apuro.</p>
            <Link className="text-link" to="/menu">Conocé todas las opciones →</Link>
          </div>
          <img src="/images/vaso-cafe-manos.webp" alt="Vaso de café sostenido entre las manos" />
        </div>
      </section>
      <section className="section-space featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">LOS ELEGIDOS</p>
              <h2>Favoritos de la casa</h2>
            </div>
            <Link className="text-link" to="/menu">Ver menú completo →</Link>
          </div>
          <div className="row g-4">
            {destacados.map((producto) => (
              <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                <ProductCard producto={producto} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space cat-section">
        <div className="container cat-card">
          <img src="/images/entrada/gato-taza-naranja.webp" alt="Gatito dentro de una taza naranja" />
          <div>
            <p className="eyebrow">¿QUÉ VAS A ELEGIR HOY?</p>
            <h2>El gatito ahora te lleva directo al menú.</h2>
            <p>Cafés, tortas, panadería y opciones saladas en un mismo lugar.</p>
            <Link className="btn btn-light" to="/menu">Ir al menú</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Inicio

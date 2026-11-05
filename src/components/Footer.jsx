import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="cafe-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">Café Loop</p>
          <p>Café de especialidad, música y una pausa sin apuro.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/menu">Menú</Link>
          <Link to="/carrito">Carrito</Link>
        </div>
        <div>
          <p className="footer-title">Visitános</p>
          <p>Obispo Trejo 950, Nueva Córdoba</p>
          <p>Lunes a sábado de 8 a 21 h</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

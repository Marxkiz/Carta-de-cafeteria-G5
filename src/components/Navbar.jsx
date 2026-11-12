import { NavLink } from 'react-router-dom'
import { useCafeteria } from '@/context/CafeteriaContext.jsx'

function Navbar() {
  const { cantidadTotal } = useCafeteria()
  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

  return (
    <nav className="navbar navbar-expand-lg sticky-top cafe-navbar" aria-label="Navegación principal">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <span className="brand-mark">CL</span>
          <span>Café Loop</span>
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className={navClass} to="/">Inicio</NavLink>
            <NavLink className={navClass} to="/menu">Menú</NavLink>
            <NavLink className={navClass} to="/tienda">Tienda</NavLink>
            <NavLink className={navClass} to="/cuenta">Cuenta</NavLink>
            <NavLink className="btn cart-button ms-lg-2" to="/carrito">
              Carrito <span className="cart-count">{cantidadTotal}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

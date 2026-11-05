import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <section className="not-found section-space">
      <h1>Página no encontrada</h1>
      <Link className="btn btn-cafe" to="/">Volver al inicio</Link>
    </section>
  )
}

export default NoEncontrada

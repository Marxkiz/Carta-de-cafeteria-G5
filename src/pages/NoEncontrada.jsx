import { useNavigate } from 'react-router-dom'

function NoEncontrada() {
  const navigate = useNavigate()

  return (
    <section className="not-found section-space">
      <h1>Página no encontrada</h1>
      <button className="btn btn-cafe" type="button" onClick={() => navigate('/')}>Volver al inicio</button>
    </section>
  )
}

export default NoEncontrada

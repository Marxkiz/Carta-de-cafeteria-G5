import { useEffect, useState } from 'react'

function Bienvenida() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem('cafeLoopIntroVisto') !== '1'
    } catch {
      return true
    }
  })
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    if (!visible) return

    try {
      sessionStorage.setItem('cafeLoopIntroVisto', '1')
    } catch {
      // La bienvenida también funciona cuando el navegador bloquea el almacenamiento.
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false)
      return
    }

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const salida = window.setTimeout(() => setSaliendo(true), 850)
    const fin = window.setTimeout(() => setVisible(false), 2200)

    return () => {
      window.clearTimeout(salida)
      window.clearTimeout(fin)
      document.body.style.overflow = overflowAnterior
    }
  }, [visible])

  if (!visible) return null

  function finalizarAnimacion(event) {
    if (event.target === event.currentTarget && event.propertyName === 'transform') {
      setVisible(false)
    }
  }

  return (
    <div className={`welcome-screen${saliendo ? ' welcome-screen-exit' : ''}`} role="status" onTransitionEnd={finalizarAnimacion}>
      <div className="welcome-content">
        <p className="welcome-brand">CAFÉ <span>LOOP</span></p>
        <p className="welcome-tagline">UNA PAUSA HECHA PARA QUEDARSE</p>
      </div>
    </div>
  )
}

export default Bienvenida

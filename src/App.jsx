import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout.jsx'
import Inicio from '@/pages/Inicio.jsx'
import Menu from '@/pages/Menu.jsx'
import Tienda from '@/pages/Tienda.jsx'
import Carrito from '@/pages/Carrito.jsx'
import Cuenta from '@/pages/Cuenta.jsx'
import NoEncontrada from '@/pages/NoEncontrada.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default App

import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'

function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app-shell">
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  )
}

export default Layout

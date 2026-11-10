import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/styles/main.scss'
import App from '@/App.jsx'
import { CafeteriaProvider } from '@/context/CafeteriaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <CafeteriaProvider>
        <App />
      </CafeteriaProvider>
    </HashRouter>
  </StrictMode>,
)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '@/components/FormInput.jsx'
import { validarCampo, validarFormulario } from '@/utils/validaciones.js'

const datosIniciales = {
  nombre: '',
  email: '',
  repetirEmail: '',
  password: '',
  repetirPassword: '',
  telefono: '',
}

function Cuenta() {
  const navigate = useNavigate()
  const [esRegistro, setEsRegistro] = useState(false)
  const [datos, setDatos] = useState(datosIniciales)
  const [errores, setErrores] = useState({})

  function cambiarCampo(event) {
    const { name, value } = event.target
    const nuevosDatos = { ...datos, [name]: value }
    setDatos(nuevosDatos)
    setErrores((actuales) => ({
      ...actuales,
      [name]: validarCampo(name, value, nuevosDatos, esRegistro),
    }))
  }

  function cambiarModo() {
    setEsRegistro((actual) => !actual)
    setDatos(datosIniciales)
    setErrores({})
  }

  function enviarFormulario(event) {
    event.preventDefault()
    const nuevosErrores = validarFormulario(datos, esRegistro)
    setErrores(nuevosErrores)
    if (Object.values(nuevosErrores).some(Boolean)) return

    localStorage.setItem('cafe-loop-usuario', JSON.stringify({
      nombre: datos.nombre || datos.email.split('@')[0],
      email: datos.email,
    }))
    navigate('/')
  }

  return (
    <section className="account-page section-space">
      <div className="container account-layout">
        <div className="account-copy">
          <p className="eyebrow">CAFÉ LOOP</p>
          <h1>{esRegistro ? 'Creá tu cuenta' : 'Volvé a tu lugar favorito'}</h1>
          <p>Guardamos tu sesión en este dispositivo para demostrar el uso de localStorage.</p>
        </div>
        <form className="account-form" onSubmit={enviarFormulario} noValidate>
          {esRegistro && <FormInput id="nombre" name="nombre" label="Nombre" value={datos.nombre} onChange={cambiarCampo} error={errores.nombre} placeholder="Lucas" maxLength="40" />}
          <FormInput id="email" name="email" type="email" label="Correo electrónico" value={datos.email} onChange={cambiarCampo} error={errores.email} placeholder="nombre@correo.com" maxLength="80" />
          {esRegistro && <FormInput id="repetirEmail" name="repetirEmail" type="email" label="Repetir correo" value={datos.repetirEmail} onChange={cambiarCampo} error={errores.repetirEmail} placeholder="Repetí tu correo" maxLength="80" />}
          <FormInput id="password" name="password" type="password" label="Contraseña" value={datos.password} onChange={cambiarCampo} error={errores.password} placeholder="Mínimo 6 caracteres" maxLength="30" />
          {esRegistro && <FormInput id="repetirPassword" name="repetirPassword" type="password" label="Repetir contraseña" value={datos.repetirPassword} onChange={cambiarCampo} error={errores.repetirPassword} placeholder="Repetí tu contraseña" maxLength="30" />}
          {esRegistro && <FormInput id="telefono" name="telefono" type="tel" label="Teléfono" value={datos.telefono} onChange={cambiarCampo} error={errores.telefono} placeholder="3511234567" maxLength="15" />}
          <button className="btn btn-cafe btn-lg w-100" type="submit">{esRegistro ? 'Registrarme' : 'Iniciar sesión'}</button>
          <button className="account-switch" type="button" onClick={cambiarModo}>{esRegistro ? 'Ya tengo una cuenta' : 'Quiero registrarme'}</button>
        </form>
      </div>
    </section>
  )
}

export default Cuenta

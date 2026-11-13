import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '@/components/FormInput.jsx'
import { useSesion } from '@/context/SesionContext.jsx'
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
  const { usuario, perfilAnterior, error: errorSesion, registrar, iniciarSesion, cerrarSesion } = useSesion()
  const primerCampoRef = useRef(null)
  const tituloPerfilRef = useRef(null)
  const errorRef = useRef(null)
  const enviandoRef = useRef(false)
  const [esRegistro, setEsRegistro] = useState(Boolean(perfilAnterior))
  const [datos, setDatos] = useState(() => ({ ...datosIniciales, ...perfilAnterior }))
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)
  const aviso = confirmacion?.email === (usuario?.email ?? null) ? confirmacion?.texto : ''

  useEffect(() => {
    if (usuario) tituloPerfilRef.current?.focus()
    else primerCampoRef.current?.focus()
  }, [esRegistro, usuario])

  useEffect(() => {
    if (mensajeError) errorRef.current?.focus()
  }, [mensajeError])

  function cambiarCampo(event) {
    const { name, value } = event.target
    const nuevosDatos = { ...datos, [name]: value }
    setDatos(nuevosDatos)
    setMensajeError('')
    setConfirmacion(null)
    setErrores((actuales) => ({
      ...actuales,
      [name]: validarCampo(name, value, nuevosDatos, esRegistro),
      ...(esRegistro && name === 'email' && datos.repetirEmail
        ? { repetirEmail: validarCampo('repetirEmail', datos.repetirEmail, nuevosDatos, esRegistro) } : {}),
      ...(esRegistro && name === 'password' && datos.repetirPassword
        ? { repetirPassword: validarCampo('repetirPassword', datos.repetirPassword, nuevosDatos, esRegistro) } : {}),
    }))
  }

  function cambiarModo() {
    setEsRegistro((actual) => !actual)
    setDatos({ ...datosIniciales, email: datos.email })
    setErrores({})
    setMensajeError('')
    setConfirmacion(null)
  }

  async function enviarFormulario(event) {
    event.preventDefault()
    if (enviandoRef.current) return
    const nuevosErrores = validarFormulario(datos, esRegistro)
    setErrores(nuevosErrores)
    setMensajeError('')
    setConfirmacion(null)
    const primerError = Object.keys(nuevosErrores).find((campo) => nuevosErrores[campo])
    if (primerError) {
      event.currentTarget.elements.namedItem(primerError)?.focus()
      return
    }

    enviandoRef.current = true
    setEnviando(true)
    try {
      if (esRegistro) await registrar(datos)
      else await iniciarSesion(datos)
      setDatos(datosIniciales)
      setConfirmacion({ email: datos.email.trim().toLowerCase(), texto: esRegistro ? 'Tu cuenta se creó correctamente. ¡Ya estás dentro!' : 'Iniciaste sesión correctamente.' })
    } catch (error) {
      setMensajeError(error.message || 'No pudimos ingresar a tu cuenta. Volvé a intentar.')
    } finally {
      enviandoRef.current = false
      setEnviando(false)
    }
  }

  async function salir() {
    if (enviandoRef.current) return
    enviandoRef.current = true
    setEnviando(true)
    setMensajeError('')
    try {
      await cerrarSesion()
      setDatos({ ...datosIniciales, email: usuario.email })
      setEsRegistro(false)
      setErrores({})
      setConfirmacion({ email: null, texto: 'Cerraste sesión. Tu cuenta sigue guardada para cuando quieras volver.' })
    } catch (error) {
      setMensajeError(error.message || 'No pudimos cerrar la sesión. Volvé a intentar.')
    } finally {
      enviandoRef.current = false
      setEnviando(false)
    }
  }

  return (
    <section className="account-page section-space">
      <div className="container account-layout">
        <div className="account-copy">
          <p className="eyebrow">CAFÉ LOOP</p>
          <h1>{usuario ? `Hola, ${usuario.nombre.split(' ')[0]}` : esRegistro ? 'Creá tu cuenta' : 'Volvé a tu lugar favorito'}</h1>
          <p>Tu cuenta se guarda en este navegador. Te recordamos cuando volvés, hasta que cierres sesión.</p>
        </div>
        {usuario ? <div className="account-form" aria-busy={enviando}>
          <h2 ref={tituloPerfilRef} tabIndex={-1}>Tu cuenta</h2>
          {aviso && <p className="account-notice" role="status">{aviso}</p>}
          <dl className="account-details">
            <dt>Nombre</dt><dd>{usuario.nombre}</dd>
            <dt>Correo electrónico</dt><dd>{usuario.email}</dd>
            <dt>Teléfono</dt><dd>{usuario.telefono}</dd>
          </dl>
          {mensajeError && <p className="field-error" role="alert" ref={errorRef} tabIndex={-1}>{mensajeError}</p>}
          <button className="btn btn-cafe btn-lg w-100" type="button" onClick={() => navigate('/menu')}>Ir al menú</button>
          <button className="account-switch" type="button" onClick={salir} disabled={enviando}>{enviando ? 'Cerrando sesión…' : 'Cerrar sesión'}</button>
        </div> : <form className="account-form" onSubmit={enviarFormulario} noValidate aria-busy={enviando} aria-label={esRegistro ? 'Registro de cuenta' : 'Inicio de sesión'}>
          {perfilAnterior && esRegistro && <p className="account-notice">Encontramos tus datos anteriores. Completá el registro una vez para guardar tu cuenta y contraseña.</p>}
          {aviso && <p className="account-notice" role="status">{aviso}</p>}
          {(mensajeError || errorSesion) && <p className="field-error" role="alert" ref={errorRef} tabIndex={-1}>{mensajeError || errorSesion}</p>}
          {esRegistro && <FormInput ref={primerCampoRef} id="nombre" name="nombre" label="Nombre" value={datos.nombre} onChange={cambiarCampo} error={errores.nombre} placeholder="Lucas" maxLength="40" autoComplete="name" required disabled={enviando} />}
          <FormInput ref={esRegistro ? undefined : primerCampoRef} id="email" name="email" type="email" label="Correo electrónico" value={datos.email} onChange={cambiarCampo} error={errores.email} placeholder="nombre@correo.com" maxLength="80" autoComplete="username" autoCapitalize="none" required disabled={enviando} />
          {esRegistro && <FormInput id="repetirEmail" name="repetirEmail" type="email" label="Repetir correo" value={datos.repetirEmail} onChange={cambiarCampo} error={errores.repetirEmail} placeholder="Repetí tu correo" maxLength="80" autoComplete="email" autoCapitalize="none" required disabled={enviando} />}
          <FormInput id="password" name="password" type="password" label="Contraseña" value={datos.password} onChange={cambiarCampo} error={errores.password} placeholder="Mínimo 6 caracteres" maxLength="72" autoComplete={esRegistro ? 'new-password' : 'current-password'} required disabled={enviando} />
          {esRegistro && <FormInput id="repetirPassword" name="repetirPassword" type="password" label="Repetir contraseña" value={datos.repetirPassword} onChange={cambiarCampo} error={errores.repetirPassword} placeholder="Repetí tu contraseña" maxLength="72" autoComplete="new-password" required disabled={enviando} />}
          {esRegistro && <FormInput id="telefono" name="telefono" type="tel" label="Teléfono" value={datos.telefono} onChange={cambiarCampo} error={errores.telefono} placeholder="3511234567" maxLength="15" autoComplete="tel" inputMode="numeric" required disabled={enviando} />}
          <button className="btn btn-cafe btn-lg w-100" type="submit" disabled={enviando}>{enviando ? 'Guardando…' : esRegistro ? 'Registrarme' : 'Iniciar sesión'}</button>
          <button className="account-switch" type="button" onClick={cambiarModo} disabled={enviando}>{esRegistro ? 'Ya tengo una cuenta' : 'Quiero registrarme'}</button>
        </form>
        }
      </div>
    </section>
  )
}

export default Cuenta

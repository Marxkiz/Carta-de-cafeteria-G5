function FormInput({ id, label, error, size = 30, ...inputProps }) {
  const errorId = `${id}-error`

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} size={size} className={`form-control ${error ? 'is-invalid' : ''}`} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...inputProps} />
      {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
    </div>
  )
}

export default FormInput

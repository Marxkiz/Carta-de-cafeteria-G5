export function rutaImagen(ruta) {
  return `${import.meta.env.BASE_URL}${ruta.replace(/^\/+/, '')}`
}

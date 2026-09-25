const contadorCarrito = document.querySelector('.badge-carrito');
const botonAgregar = document.querySelector('.btn-agregar-carrito');
const botonCarrito = document.querySelector('.btn-carrito-icon');

let cantidadProductos = 0;

botonAgregar?.addEventListener('click', () => {
  cantidadProductos += 1;
  contadorCarrito.textContent = cantidadProductos;
});

botonCarrito?.addEventListener('click', (evento) => {
  evento.preventDefault();
  const texto = cantidadProductos === 1
    ? 'Tenés 1 producto en el carrito.'
    : `Tenés ${cantidadProductos} productos en el carrito.`;
  alert(texto);
});

const mensajes = {
  ubicacion: 'La ubicación estará disponible próximamente.',
  nosotros: 'La sección Sobre nosotros estará disponible próximamente.',
  buscar: 'La búsqueda estará disponible próximamente.',
  perfil: 'El perfil estará disponible próximamente.',
  cuestionario: 'El cuestionario estará disponible próximamente.'
};

document.querySelectorAll('[data-action]').forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();
    alert(mensajes[enlace.dataset.action]);
  });
});

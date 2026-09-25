const CLAVE_CARRITO = 'caffeLoopCarrito';

const botonCarrito = document.querySelector('.btn-carrito-icon');
const badgeCarrito = document.querySelector('.badge-carrito');
const panelCarrito = document.querySelector('.carrito-panel');
const overlayCarrito = document.querySelector('.carrito-overlay');
const listaCarrito = document.querySelector('.carrito-lista');
const mensajeVacio = document.querySelector('.carrito-vacio');
const totalCarrito = document.querySelector('.carrito-total');
const botonVaciar = document.querySelector('.carrito-vaciar');
const botonesCerrar = document.querySelectorAll('[data-cerrar-carrito]');

const mensajes = {
  ubicacion: 'Muy pronto vas a poder consultar nuestra ubicación.',
  nosotros: 'Estamos preparando la historia de Café Loop.',
  buscar: 'El buscador estará disponible próximamente.',
  perfil: 'La sección de perfil estará disponible próximamente.',
  cuestionario: 'El cuestionario para encontrar tu café ideal estará disponible próximamente.'
};

function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(guardado) ? guardado : [];
  } catch (error) {
    return [];
  }
}

let carrito = cargarCarrito();

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);
}

function guardarCarrito() {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    // El carrito sigue funcionando durante la visita aunque el navegador bloquee el almacenamiento.
  }
}

function crearBotonCantidad(texto, accion, id, etiqueta) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'cantidad-btn';
  boton.textContent = texto;
  boton.dataset.accion = accion;
  boton.dataset.id = id;
  boton.setAttribute('aria-label', etiqueta);
  return boton;
}

function crearItemCarrito(producto) {
  const item = document.createElement('article');
  item.className = 'carrito-item';

  const info = document.createElement('div');
  info.className = 'carrito-item-info';

  const nombre = document.createElement('strong');
  nombre.className = 'carrito-item-nombre';
  nombre.textContent = producto.nombre;

  const precio = document.createElement('span');
  precio.className = 'carrito-item-precio';
  precio.textContent = formatearPrecio(producto.precio * producto.cantidad);

  const acciones = document.createElement('div');
  acciones.className = 'carrito-item-acciones';

  const cantidad = document.createElement('div');
  cantidad.className = 'carrito-cantidad';
  cantidad.append(
    crearBotonCantidad('−', 'restar', producto.id, 'Quitar una unidad de ' + producto.nombre)
  );

  const numero = document.createElement('span');
  numero.textContent = producto.cantidad;
  numero.setAttribute('aria-label', producto.cantidad + ' unidades');
  cantidad.append(numero);
  cantidad.append(
    crearBotonCantidad('+', 'sumar', producto.id, 'Agregar una unidad de ' + producto.nombre)
  );

  const eliminar = document.createElement('button');
  eliminar.type = 'button';
  eliminar.className = 'carrito-eliminar';
  eliminar.textContent = 'Eliminar';
  eliminar.dataset.accion = 'eliminar';
  eliminar.dataset.id = producto.id;
  eliminar.setAttribute('aria-label', 'Eliminar ' + producto.nombre + ' del carrito');

  info.append(nombre, precio);
  acciones.append(cantidad, eliminar);
  item.append(info, acciones);

  return item;
}

function renderizarCarrito() {
  listaCarrito.replaceChildren();

  carrito.forEach((producto) => {
    listaCarrito.append(crearItemCarrito(producto));
  });

  const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  const precioTotal = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );

  badgeCarrito.textContent = cantidadTotal;
  totalCarrito.textContent = formatearPrecio(precioTotal);
  mensajeVacio.classList.toggle('oculto', carrito.length > 0);
  botonVaciar.disabled = carrito.length === 0;
  guardarCarrito();
}

function abrirCarrito() {
  panelCarrito.classList.add('abierto');
  overlayCarrito.classList.add('activo');
  panelCarrito.setAttribute('aria-hidden', 'false');
  botonCarrito.setAttribute('aria-expanded', 'true');
  document.body.classList.add('carrito-abierto');
  panelCarrito.querySelector('.carrito-cerrar').focus();
}

function cerrarCarrito() {
  panelCarrito.classList.remove('abierto');
  overlayCarrito.classList.remove('activo');
  panelCarrito.setAttribute('aria-hidden', 'true');
  botonCarrito.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('carrito-abierto');
}

function agregarProducto(boton) {
  const id = boton.dataset.productoId;
  const nombre = boton.dataset.productoNombre;
  const precio = Number(boton.dataset.productoPrecio);

  if (!id || !nombre || !Number.isFinite(precio)) {
    return;
  }

  const productoExistente = carrito.find((producto) => producto.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  renderizarCarrito();
  botonCarrito.classList.remove('agregado');
  void botonCarrito.offsetWidth;
  botonCarrito.classList.add('agregado');
  abrirCarrito();
}

document.querySelectorAll('.btn-agregar-carrito').forEach((boton) => {
  boton.addEventListener('click', () => agregarProducto(boton));
});

botonCarrito.addEventListener('click', abrirCarrito);
botonesCerrar.forEach((boton) => boton.addEventListener('click', cerrarCarrito));

listaCarrito.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-accion]');
  if (!boton) {
    return;
  }

  const producto = carrito.find((item) => item.id === boton.dataset.id);
  if (!producto) {
    return;
  }

  if (boton.dataset.accion === 'sumar') {
    producto.cantidad += 1;
  }

  if (boton.dataset.accion === 'restar') {
    producto.cantidad -= 1;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter((item) => item.id !== producto.id);
    }
  }

  if (boton.dataset.accion === 'eliminar') {
    carrito = carrito.filter((item) => item.id !== producto.id);
  }

  renderizarCarrito();
});

botonVaciar.addEventListener('click', () => {
  carrito = [];
  renderizarCarrito();
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && panelCarrito.classList.contains('abierto')) {
    cerrarCarrito();
    botonCarrito.focus();
  }
});

document.querySelectorAll('[data-action]').forEach((elemento) => {
  elemento.addEventListener('click', (evento) => {
    evento.preventDefault();
    const mensaje = mensajes[elemento.dataset.action];
    if (mensaje) {
      window.alert(mensaje);
    }
  });
});

renderizarCarrito();

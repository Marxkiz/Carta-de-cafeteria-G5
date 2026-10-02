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
  if (!listaCarrito || !badgeCarrito || !totalCarrito || !mensajeVacio || !botonVaciar) return;

  listaCarrito.replaceChildren();
  carrito.forEach((producto) => listaCarrito.append(crearItemCarrito(producto)));

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
  if (!panelCarrito || !overlayCarrito || !botonCarrito) return;
  panelCarrito.classList.add('abierto');
  overlayCarrito.classList.add('activo');
  panelCarrito.setAttribute('aria-hidden', 'false');
  botonCarrito.setAttribute('aria-expanded', 'true');
  document.body.classList.add('carrito-abierto');
  panelCarrito.querySelector('.carrito-cerrar')?.focus();
}

function cerrarCarrito() {
  if (!panelCarrito || !overlayCarrito || !botonCarrito) return;
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

  if (!id || !nombre || !Number.isFinite(precio) || precio < 0) return;

  const productoExistente = carrito.find((producto) => producto.id === id);
  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }

  renderizarCarrito();
  if (botonCarrito) {
    botonCarrito.classList.remove('agregado');
    void botonCarrito.offsetWidth;
    botonCarrito.classList.add('agregado');
  }
  abrirCarrito();
}

document.querySelectorAll('.btn-agregar-carrito').forEach((boton) => {
  boton.addEventListener('click', () => agregarProducto(boton));
});

botonCarrito?.addEventListener('click', abrirCarrito);
botonesCerrar.forEach((boton) => boton.addEventListener('click', cerrarCarrito));

listaCarrito?.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-accion]');
  if (!boton) return;

  const producto = carrito.find((item) => item.id === boton.dataset.id);
  if (!producto) return;

  if (boton.dataset.accion === 'sumar') producto.cantidad += 1;

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

botonVaciar?.addEventListener('click', () => {
  carrito = [];
  renderizarCarrito();
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && panelCarrito?.classList.contains('abierto')) {
    cerrarCarrito();
    botonCarrito?.focus();
  }
});

// Cuestionario: ofrece una recomendación real a partir de las respuestas.
const quizDialog = document.querySelector('#quiz-dialog');
const quizForm = document.querySelector('#quiz-form');
const quizResult = document.querySelector('#quiz-result');

function abrirCuestionario() {
  if (!quizDialog) {
    window.location.href = 'index.html#quiz-dialog';
    return;
  }
  quizForm?.reset();
  if (quizResult) {
    quizResult.hidden = true;
    quizResult.textContent = '';
  }
  if (typeof quizDialog.showModal === 'function') {
    quizDialog.showModal();
  } else {
    quizDialog.setAttribute('open', '');
  }
}

document.querySelectorAll('[data-action="cuestionario"]').forEach((elemento) => {
  elemento.addEventListener('click', abrirCuestionario);
});

document.querySelectorAll('[data-cerrar-cuestionario]').forEach((boton) => {
  boton.addEventListener('click', () => quizDialog?.close());
});

quizDialog?.addEventListener('click', (evento) => {
  if (evento.target === quizDialog) quizDialog.close();
});

quizForm?.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const respuestas = new FormData(quizForm);
  const perfil = respuestas.get('perfil');
  const metodo = respuestas.get('metodo');

  let recomendacion = {
    nombre: 'Cappuccino',
    detalle: 'Equilibrado y cremoso, ideal para una pausa clásica.'
  };

  if (metodo === 'frio') {
    recomendacion = {
      nombre: 'Iced coffee',
      detalle: 'Refrescante, con café frío y un perfil suave.'
    };
  } else if (perfil === 'suave') {
    recomendacion = {
      nombre: 'Latte',
      detalle: 'Suave y cremoso, con leche vaporizada.'
    };
  } else if (perfil === 'intenso') {
    recomendacion = {
      nombre: 'Espresso',
      detalle: 'Corto, intenso y con una crema persistente.'
    };
  } else if (metodo === 'filtrado') {
    recomendacion = {
      nombre: 'Café de la casa',
      detalle: 'Una opción para disfrutar con calma los matices del café.'
    };
  }

  if (quizResult) {
    quizResult.replaceChildren();
    const titulo = document.createElement('strong');
    titulo.textContent = 'Tu café recomendado: ' + recomendacion.nombre;
    const descripcion = document.createElement('p');
    descripcion.textContent = recomendacion.detalle;
    const enlace = document.createElement('a');
    enlace.href = 'menu.html#cafes';
    enlace.className = 'link-flecha';
    enlace.textContent = 'Ver en el menú →';
    quizResult.append(titulo, descripcion, enlace);
    quizResult.hidden = false;
  }
});

// Newsletter: formulario local de demostración (sin envío a un servidor).
const newsletterForm = document.querySelector('#newsletter-form');
const newsletterFeedback = document.querySelector('#newsletter-feedback');

newsletterForm?.addEventListener('submit', (evento) => {
  evento.preventDefault();
  if (!newsletterForm.reportValidity()) return;
  if (newsletterFeedback) {
    newsletterFeedback.textContent = '¡Gracias por suscribirte! Este formulario es una demostración y no envía correos.';
  }
  newsletterForm.reset();
});

// Botón flotante de ayuda: lleva a la sección institucional en lugar de mostrar un alert.
document.querySelectorAll('[data-action="nosotros"]').forEach((elemento) => {
  elemento.addEventListener('click', () => {
    document.querySelector('#nosotros')?.scrollIntoView({ behavior: 'smooth' });
  });
});

renderizarCarrito();

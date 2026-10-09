const CLAVE_CARRITO = "caffeLoopCarrito";

/* =========================================================
   UTILIDADES GENERALES
========================================================= */

function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function leerJSON(clave, defecto) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? defecto;
  } catch {
    return defecto;
  }
}

/* =========================================================
   CARRITO
========================================================= */

const botonCarrito = document.querySelector(".btn-carrito-icon");
const badgeCarrito = document.querySelector(".badge-carrito");
const panelCarrito = document.querySelector(".carrito-panel");
const overlayCarrito = document.querySelector(".carrito-overlay");
const listaCarrito = document.querySelector(".carrito-lista");
const mensajeVacio = document.querySelector(".carrito-vacio");
const totalCarrito = document.querySelector(".carrito-total");
const botonVaciar = document.querySelector(".carrito-vaciar");
const botonFinalizar = document.querySelector(".carrito-finalizar");
const botonesCerrarCarrito = document.querySelectorAll("[data-cerrar-carrito]");

function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

let carrito = cargarCarrito();

function guardarCarrito() {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch {
    /*
      El carrito sigue funcionando durante la visita aunque
      el navegador bloquee el almacenamiento.
    */
  }
}

function crearBotonCantidad(texto, accion, id, etiqueta) {
  const boton = document.createElement("button");

  boton.type = "button";
  boton.className = "cantidad-btn";
  boton.textContent = texto;
  boton.dataset.accion = accion;
  boton.dataset.id = id;

  boton.setAttribute("aria-label", etiqueta);

  return boton;
}

function crearItemCarrito(producto) {
  const item = document.createElement("article");
  item.className = "carrito-item";

  const info = document.createElement("div");
  info.className = "carrito-item-info";

  const nombre = document.createElement("strong");
  nombre.className = "carrito-item-nombre";
  nombre.textContent = producto.nombre;

  const precio = document.createElement("span");
  precio.className = "carrito-item-precio";
  precio.textContent = formatearPrecio(producto.precio * producto.cantidad);

  const acciones = document.createElement("div");
  acciones.className = "carrito-item-acciones";

  const cantidad = document.createElement("div");
  cantidad.className = "carrito-cantidad";

  cantidad.append(
    crearBotonCantidad(
      "−",
      "restar",
      producto.id,
      "Quitar una unidad de " + producto.nombre,
    ),
  );

  const numero = document.createElement("span");
  numero.textContent = producto.cantidad;
  numero.setAttribute("aria-label", `${producto.cantidad} unidades`);

  cantidad.append(numero);

  cantidad.append(
    crearBotonCantidad(
      "+",
      "sumar",
      producto.id,
      "Agregar una unidad de " + producto.nombre,
    ),
  );

  const eliminar = document.createElement("button");

  eliminar.type = "button";
  eliminar.className = "carrito-eliminar";
  eliminar.textContent = "Eliminar";
  eliminar.dataset.accion = "eliminar";
  eliminar.dataset.id = producto.id;

  eliminar.setAttribute(
    "aria-label",
    "Eliminar " + producto.nombre + " del carrito",
  );

  info.append(nombre, precio);
  acciones.append(cantidad, eliminar);
  item.append(info, acciones);

  return item;
}

function renderizarCarrito(guardar = true) {
  if (
    !listaCarrito ||
    !badgeCarrito ||
    !totalCarrito ||
    !mensajeVacio ||
    !botonVaciar
  ) {
    return;
  }

  listaCarrito.replaceChildren();

  carrito.forEach((producto) => {
    listaCarrito.append(crearItemCarrito(producto));
  });

  const cantidadTotal = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  const precioTotal = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0,
  );

  badgeCarrito.textContent = cantidadTotal;

  totalCarrito.textContent = formatearPrecio(precioTotal);

  mensajeVacio.classList.toggle("oculto", carrito.length > 0);

  botonVaciar.disabled = carrito.length === 0;

  if (botonFinalizar) {
    botonFinalizar.disabled = carrito.length === 0;
  }

  if (guardar) {
    guardarCarrito();
  }
}

function abrirCarrito() {
  if (!panelCarrito || !overlayCarrito || !botonCarrito) {
    return;
  }

  panelCarrito.classList.add("abierto");
  overlayCarrito.classList.add("activo");

  panelCarrito.setAttribute("aria-hidden", "false");

  botonCarrito.setAttribute("aria-expanded", "true");

  document.body.classList.add("carrito-abierto");

  panelCarrito.querySelector(".carrito-cerrar")?.focus();
}

function cerrarCarrito() {
  if (!panelCarrito || !overlayCarrito || !botonCarrito) {
    return;
  }

  panelCarrito.classList.remove("abierto");
  overlayCarrito.classList.remove("activo");

  panelCarrito.setAttribute("aria-hidden", "true");

  botonCarrito.setAttribute("aria-expanded", "false");

  document.body.classList.remove("carrito-abierto");
}

function agregarProducto(boton) {
  if (!boton) {
    return;
  }

  const id = boton.dataset.productoId;

  const nombre = boton.dataset.productoNombre;

  const precio = Number(boton.dataset.productoPrecio);

  if (!id || !nombre || !Number.isFinite(precio) || precio < 0) {
    return;
  }

  const productoExistente = carrito.find((producto) => producto.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      id,
      nombre,
      precio,
      cantidad: 1,
    });
  }

  renderizarCarrito();

  if (botonCarrito) {
    botonCarrito.classList.remove("agregado");

    void botonCarrito.offsetWidth;

    botonCarrito.classList.add("agregado");
  }

  abrirCarrito();
}

document.querySelectorAll(".btn-agregar-carrito").forEach((boton) => {
  boton.addEventListener("click", () => agregarProducto(boton));
});

botonCarrito?.addEventListener("click", abrirCarrito);

botonesCerrarCarrito.forEach((boton) => {
  boton.addEventListener("click", cerrarCarrito);
});

listaCarrito?.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");

  if (!boton) {
    return;
  }

  const producto = carrito.find((item) => item.id === boton.dataset.id);

  if (!producto) {
    return;
  }

  if (boton.dataset.accion === "sumar") {
    producto.cantidad += 1;
  }

  if (boton.dataset.accion === "restar") {
    producto.cantidad -= 1;

    if (producto.cantidad <= 0) {
      carrito = carrito.filter((item) => item.id !== producto.id);
    }
  }

  if (boton.dataset.accion === "eliminar") {
    carrito = carrito.filter((item) => item.id !== producto.id);
  }

  renderizarCarrito();
});

botonVaciar?.addEventListener("click", () => {
  carrito = [];
  renderizarCarrito();
});

/* =========================================================
   CHECKOUT
========================================================= */

let checkoutDialog = null;

function crearCheckout() {
  if (checkoutDialog) return checkoutDialog;

  checkoutDialog = document.createElement("dialog");
  checkoutDialog.className = "checkout-dialog";
  checkoutDialog.setAttribute("aria-labelledby", "checkout-titulo");
  checkoutDialog.innerHTML = `
    <div class="checkout-contenido">
      <button type="button" class="checkout-cerrar" aria-label="Cerrar confirmación">×</button>
      <h2 class="serif" id="checkout-titulo">¡Compra realizada!</h2>
      <button type="button" class="boton boton-oscuro checkout-listo">Listo</button>
    </div>
  `;
  document.body.append(checkoutDialog);

  function cerrarConfirmacion() {
    checkoutDialog.close();
    botonCarrito?.focus();
  }

  checkoutDialog.querySelector(".checkout-cerrar").addEventListener("click", cerrarConfirmacion);
  checkoutDialog.querySelector(".checkout-listo").addEventListener("click", cerrarConfirmacion);
  checkoutDialog.addEventListener("click", (evento) => {
    if (evento.target === checkoutDialog) cerrarConfirmacion();
  });
  return checkoutDialog;
}

botonFinalizar?.addEventListener("click", () => {
  if (carrito.length === 0) return;
  carrito = [];
  renderizarCarrito();
  cerrarCarrito();
  crearCheckout().showModal();
});

/* =========================================================
   ESC PARA CERRAR
========================================================= */

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && panelCarrito?.classList.contains("abierto")) {
    cerrarCarrito();
    botonCarrito?.focus();
  }
});

/* =========================================================
   CUESTIONARIO
========================================================= */

const quizDialog = document.querySelector("#quiz-dialog");

const quizForm = document.querySelector("#quiz-form");

const quizResult = document.querySelector("#quiz-result");

const pasos = [...document.querySelectorAll("[data-quiz-paso]")];

let pasoActual = 0;

function mostrarPaso() {
  if (!pasos.length || !quizDialog) {
    return;
  }

  pasos.forEach((paso, indice) => {
    paso.hidden = indice !== pasoActual;

    paso.disabled = indice !== pasoActual;
  });

  const progreso = document.querySelector("#quiz-progreso");

  const barra = document.querySelector("#quiz-barra");

  const anterior = document.querySelector("#quiz-anterior");

  const siguiente = document.querySelector("#quiz-siguiente");

  const enviar = document.querySelector("#quiz-enviar");

  const error = document.querySelector("#quiz-error");

  if (progreso) {
    progreso.textContent = `Pregunta ${pasoActual + 1} de ${pasos.length}`;
  }

  if (barra) {
    barra.value = pasoActual + 1;
  }

  if (anterior) {
    anterior.disabled = pasoActual === 0;
  }

  if (siguiente) {
    siguiente.hidden = pasoActual === pasos.length - 1;
  }

  if (enviar) {
    enviar.hidden = pasoActual !== pasos.length - 1;
  }

  if (error) {
    error.textContent = "";
  }
}

function abrirCuestionario() {
  if (!quizDialog || !quizForm) {
    return;
  }

  quizForm.reset();

  pasoActual = 0;

  if (quizResult) {
    quizResult.hidden = true;
    quizResult.replaceChildren();
  }

  const controles = document.querySelector(".quiz-controles");

  if (controles) {
    controles.hidden = false;
  }

  mostrarPaso();

  if (!quizDialog.open) {
    quizDialog.showModal();
  }
}

document.querySelectorAll('[data-action="cuestionario"]').forEach((boton) => {
  boton.addEventListener("click", abrirCuestionario);
});

document
  .querySelector("[data-cerrar-cuestionario]")
  ?.addEventListener("click", () => quizDialog?.close());

quizDialog?.addEventListener("click", (evento) => {
  if (evento.target === quizDialog) {
    quizDialog.close();
  }
});

document.querySelector("#quiz-anterior")?.addEventListener("click", () => {
  if (pasoActual > 0) {
    pasoActual -= 1;
    mostrarPaso();
  }
});

function validarPaso() {
  if (!pasos.length) {
    return false;
  }

  const seleccionado = pasos[pasoActual]?.querySelector("input:checked");

  if (seleccionado) {
    return true;
  }

  const error = document.querySelector("#quiz-error");

  if (error) {
    error.textContent = "Elegí una opción para continuar.";
  }

  pasos[pasoActual]?.querySelector("input")?.focus();

  return false;
}

document.querySelector("#quiz-siguiente")?.addEventListener("click", () => {
  if (!validarPaso()) {
    return;
  }

  if (pasoActual < pasos.length - 1) {
    pasoActual += 1;
    mostrarPaso();
  }
});

quizForm?.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validarPaso()) {
    return;
  }

  const respuestas = {};

  pasos.forEach((paso) => {
    const input = paso.querySelector("input:checked");

    if (input) {
      respuestas[input.name] = input.value;
    }
  });

  const r = respuestas;

  let nombre = "Cappuccino";

  let id = "cafe-capuccino";

  let precio = 3300;

  if (r.cafeina === "no") {
    nombre = "Rooibos";
    id = "te-rooibos";
    precio = 2600;
  } else if (r.metodo === "frio") {
    nombre = "Iced coffee";
    id = "cafe-iced";
    precio = 3500;
  } else if (r.metodo === "filtrado") {
    nombre = "Café filtrado";
    id = "cafe-filtrado";
    precio = 3100;
  } else if (r.sabor === "chocolate" && r.leche !== "no") {
    nombre = "Mocaccino";
    id = "cafe-mocaccino";
    precio = 3600;
  } else if (r.leche === "no") {
    nombre =
      r.perfil === "intenso" || r.tiempo === "rapido"
        ? "Espresso"
        : "Americano";

    id = nombre === "Espresso" ? "cafe-espresso" : "cafe-americano";

    precio = nombre === "Espresso" ? 2200 : 2800;
  } else if (r.leche === "poca" || r.perfil === "intenso") {
    nombre = "Cortado";
    id = "cafe-cortado";
    precio = 2900;
  } else if (r.perfil === "suave" || r.sabor === "vainilla") {
    nombre = "Latte";
    id = "cafe-latte";
    precio = 3200;
  }

  const titulo = document.createElement("strong");

  titulo.textContent = `Tu bebida: ${nombre}`;

  const detalle = document.createElement("p");

  detalle.textContent = `${
    r.cafeina === "no"
      ? "Una infusión sin cafeína"
      : r.leche === "no"
        ? "Para disfrutar el café sin leche"
        : "Un café para tu gusto"
  } para ${
    r.momento === "desayuno"
      ? "arrancar el día"
      : r.momento === "merienda"
        ? "tu merienda"
        : "tu pausa"
  }. ${
    r.sabor === "vainilla" && nombre === "Latte"
      ? "Pedilo con un toque de vainilla."
      : ""
  } ${
    r.cafeina === "normal" ? "Podés pedir una sola dosis de espresso." : ""
  } ${
    r.tiempo === "rapido"
      ? "Ideal para llevar."
      : "Buscá una mesa y disfrutalo con calma."
  }`;

  const enlace = document.createElement("a");

  enlace.href = `menu.html#${id}`;

  enlace.className = "link-flecha";

  enlace.textContent = "Ver mi bebida en el menú →";

  const agregar = document.createElement("button");

  agregar.type = "button";

  agregar.className = "boton boton-oscuro";

  agregar.textContent = `Agregar ${nombre} · ${formatearPrecio(precio)}`;

  agregar.dataset.productoId = id;

  agregar.dataset.productoNombre = nombre;

  agregar.dataset.productoPrecio = precio;

  agregar.addEventListener("click", () => {
    quizDialog?.close();
    agregarProducto(agregar);
  });

  quizResult.replaceChildren(titulo, detalle, enlace, agregar);

  if (r.acompanar !== "solo") {
    const acomp = document.createElement("a");

    const dulce = r.acompanar === "dulce";

    const desayuno = r.momento === "desayuno";

    acomp.className = "link-flecha";

    acomp.href = `menu.html#${
      dulce
        ? desayuno
          ? "panaderia-medialuna"
          : "torta-brownie"
        : desayuno
          ? "salado-avocado"
          : "salado-tostado"
    }`;

    acomp.textContent = `Para acompañar: ${
      dulce
        ? desayuno
          ? "Medialuna"
          : "Brownie tibio"
        : desayuno
          ? "Avocado toast"
          : "Tostado completo"
    } →`;

    quizResult.append(acomp);
  }

  pasos.forEach((paso) => {
    paso.hidden = true;
    paso.disabled = true;
  });

  document.querySelector(".quiz-controles").hidden = true;

  quizResult.hidden = false;

  document.querySelector("#quiz-progreso").textContent =
    "Tu recomendación está lista";

  const reiniciar = document.createElement("button");

  reiniciar.type = "button";

  reiniciar.className = "cuenta-alternar";

  reiniciar.textContent = "Volver a responder";

  reiniciar.addEventListener("click", () => {
    quizForm.reset();

    pasoActual = 0;

    quizResult.hidden = true;

    document.querySelector(".quiz-controles").hidden = false;

    mostrarPaso();
  });

  quizResult.append(reiniciar);
});

mostrarPaso();

/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterForm = document.querySelector("#newsletter-form");

const newsletterFeedback = document.querySelector("#newsletter-feedback");

newsletterForm?.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!newsletterForm.reportValidity()) {
    return;
  }

  if (newsletterFeedback) {
    newsletterFeedback.textContent =
      "¡Gracias por suscribirte! Este formulario es una demostración y no envía correos.";
  }

  newsletterForm.reset();
});

/* =========================================================
   CUENTA
========================================================= */

const cuentaDialog = document.querySelector("#cuenta-dialog");

const cuentaForm = document.querySelector("#cuenta-form");

const cuentaFeedback = document.querySelector("#cuenta-feedback");

let registro = false;

function usuarioActual() {
  const sesion = leerJSON("loopSesion", null);

  const usuarios = leerJSON("loopUsuarios", []);

  if (!Array.isArray(usuarios)) {
    return null;
  }

  return usuarios.find((usuario) => usuario.email === sesion?.email) ?? null;
}

function actualizarCuenta() {
  if (!cuentaDialog || !cuentaForm) {
    return;
  }

  const usuario = usuarioActual();

  const camposRegistro = cuentaForm.querySelectorAll("[data-solo-registro]");

  cuentaForm.hidden = Boolean(usuario);

  const perfil = document.querySelector("#cuenta-perfil");

  if (perfil) {
    perfil.hidden = !usuario;
  }

  const titulo = document.querySelector("#cuenta-titulo");

  if (titulo) {
    titulo.textContent = usuario
      ? "Tu cuenta Loop"
      : registro
        ? "Crear cuenta"
        : "Iniciar sesión";
  }

  const saludo = document.querySelector("#cuenta-saludo");

  if (saludo) {
    saludo.textContent = usuario
      ? `Hola, ${usuario.nombre}. ¡Qué bueno verte por acá!`
      : "";
  }

  cuentaDialog.classList.toggle("es-registro", registro && !usuario);

  camposRegistro.forEach((elemento) => {
    elemento.hidden = !registro;

    elemento.querySelectorAll("input, select").forEach((input) => {
      input.disabled = !registro;

      input.required = registro && input.hasAttribute("data-required-registro");
    });
  });

  const password = document.querySelector("#cuenta-password");

  if (password) {
    password.autocomplete = registro ? "new-password" : "current-password";
  }

  const enviar = document.querySelector("#cuenta-enviar");

  if (enviar) {
    enviar.textContent = registro ? "Crear cuenta" : "Ingresar";
  }

  const alternar = document.querySelector("#cuenta-alternar");

  if (alternar) {
    alternar.textContent = registro
      ? "Ya tengo cuenta"
      : "¿No tenés cuenta? Registrate";
  }
}

async function derivarPassword(password, salt) {
  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(salt),
      iterations: 210000,
      hash: "SHA-256",
    },
    clave,
    256,
  );

  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function limpiarValidacionCuenta() {
  if (!cuentaForm || !cuentaFeedback) {
    return;
  }

  cuentaFeedback.textContent = "";

  cuentaForm.querySelectorAll("input, select").forEach((input) => {
    input.setCustomValidity("");
    input.removeAttribute("aria-invalid");
  });
}

function abrirCuenta(esRegistro) {
  if (!cuentaDialog || !cuentaForm) {
    return;
  }

  registro = Boolean(esRegistro);

  cuentaForm.reset();

  limpiarValidacionCuenta();

  actualizarCuenta();

  if (!cuentaDialog.open) {
    cuentaDialog.showModal();
  }
}

document.querySelectorAll("[data-abrir-cuenta]").forEach((boton) => {
  boton.addEventListener("click", () => abrirCuenta(false));
});

document.querySelectorAll("[data-abrir-registro]").forEach((boton) => {
  boton.addEventListener("click", () => abrirCuenta(true));
});

cuentaForm?.addEventListener("input", limpiarValidacionCuenta);

cuentaForm?.addEventListener("reset", limpiarValidacionCuenta);

document
  .querySelector("[data-cerrar-cuenta]")
  ?.addEventListener("click", () => cuentaDialog?.close());

cuentaDialog?.addEventListener("click", (evento) => {
  if (evento.target === cuentaDialog) {
    cuentaDialog.close();
  }
});

document.querySelector("#cuenta-alternar")?.addEventListener("click", () => {
  registro = !registro;

  limpiarValidacionCuenta();
  actualizarCuenta();
});

cuentaForm?.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  limpiarValidacionCuenta();

  const campos = cuentaForm.elements;

  if (registro) {
    let primerError = null;

    function marcarError(input, mensaje) {
      input.setCustomValidity(mensaje);

      input.setAttribute("aria-invalid", "true");

      if (!primerError) {
        primerError = {
          input,
          mensaje,
        };
      }
    }

    if (!campos.nombre.value.trim()) {
      marcarError(campos.nombre, "Ingresá tu nombre.");
    }

    if (!campos.apellido.value.trim()) {
      marcarError(campos.apellido, "Ingresá tu apellido.");
    }

    if (
      campos.email.value.trim().toLowerCase() !==
      campos.emailRepetir.value.trim().toLowerCase()
    ) {
      marcarError(campos.emailRepetir, "Los mails no coinciden.");
    }

    if (campos.password.value !== campos.passwordRepetir.value) {
      marcarError(campos.passwordRepetir, "Las contraseñas no coinciden.");
    }

    const telefono = campos.telefono.value.trim();

    const digitos = telefono.replace(/\D/g, "");

    if (
      !/^[+\d\s().-]+$/.test(telefono) ||
      digitos.length < 8 ||
      digitos.length > 15
    ) {
      marcarError(
        campos.telefono,
        "Ingresá un teléfono válido con entre 8 y 15 números.",
      );
    }

    if (primerError) {
      cuentaFeedback.textContent = primerError.mensaje;

      primerError.input.focus();

      cuentaForm.reportValidity();

      return;
    }
  }

  if (!cuentaForm.reportValidity()) {
    return;
  }

  const boton = document.querySelector("#cuenta-enviar");

  if (boton) {
    boton.disabled = true;
  }

  try {
    if (!window.crypto?.subtle) {
      throw new Error(
        "Abrí la página con Live Server o HTTPS para usar tu cuenta.",
      );
    }

    const email = cuentaForm.elements.email.value.trim().toLowerCase();

    const nombre = cuentaForm.elements.nombre.value.trim();

    const guardado = leerJSON("loopUsuarios", []);

    const usuarios = Array.isArray(guardado) ? guardado : [];

    let usuario = usuarios.find((item) => item.email === email);

    if (registro) {
      if (!nombre) {
        throw new Error("Ingresá tu nombre.");
      }

      if (usuario) {
        throw new Error("Este correo ya tiene una cuenta. Iniciá sesión.");
      }

      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));

      usuario = {
        nombre,
        apellido: campos.apellido.value.trim(),
        telefono: campos.telefono.value.trim(),
        genero: campos.genero.value,
        documento: campos.documento.value.trim(),
        domicilio: campos.domicilio.value.trim(),
        email,
        salt,
        hash: await derivarPassword(campos.password.value, salt),
      };

      usuarios.push(usuario);

      localStorage.setItem("loopUsuarios", JSON.stringify(usuarios));
    } else {
      if (
        !usuario ||
        (await derivarPassword(campos.password.value, usuario.salt)) !==
          usuario.hash
      ) {
        throw new Error("El correo o la contraseña son incorrectos.");
      }
    }

    localStorage.setItem(
      "loopSesion",
      JSON.stringify({
        email: usuario.email,
      }),
    );

    cuentaForm.reset();

    actualizarCuenta();

    if (cuentaFeedback) {
      cuentaFeedback.textContent = "Cuenta actualizada correctamente.";
    }
  } catch (error) {
    if (cuentaFeedback) {
      cuentaFeedback.textContent =
        error.message ||
        "No pudimos guardar la cuenta. Revisá el almacenamiento del navegador.";
    }
  } finally {
    if (boton) {
      boton.disabled = false;
    }
  }
});

document.querySelector("#cuenta-salir")?.addEventListener("click", () => {
  try {
    localStorage.removeItem("loopSesion");

    registro = false;

    actualizarCuenta();

    cuentaDialog?.close();
  } catch {
    if (cuentaFeedback) {
      cuentaFeedback.textContent =
        "No pudimos cerrar la sesión. Revisá el almacenamiento del navegador.";
    }
  }
});

/* =========================================================
   SINCRONIZACIÓN ENTRE PESTAÑAS
========================================================= */

window.addEventListener("storage", () => {
  actualizarCuenta();

  carrito = cargarCarrito();

  renderizarCarrito(false);
});

/* =========================================================
   FILTROS DE TIENDA
========================================================= */

const filtrosTienda = document.querySelectorAll("[data-filtro-tienda]");

const productosTienda = document.querySelectorAll("[data-tienda-categoria]");

function actualizarConteoTienda(cantidad) {
  const contador = document.querySelector("#tienda-conteo");

  if (!contador) {
    return;
  }

  contador.textContent = `${cantidad} ${
    cantidad === 1 ? "artículo" : "artículos"
  }`;
}

function aplicarFiltroTienda(categoria) {
  let visibles = 0;

  productosTienda.forEach((producto) => {
    const visible =
      categoria === "todos" || producto.dataset.tiendaCategoria === categoria;

    producto.hidden = !visible;

    if (visible) {
      visibles += 1;
    }
  });

  actualizarConteoTienda(visibles);
}

filtrosTienda.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.filtroTienda;

    filtrosTienda.forEach((filtro) => {
      filtro.setAttribute("aria-pressed", String(filtro === boton));
    });

    aplicarFiltroTienda(categoria);
  });
});

if (productosTienda.length) {
  actualizarConteoTienda(productosTienda.length);
}

/* =========================================================
   INICIALIZACIÓN
========================================================= */

renderizarCarrito();
actualizarCuenta();

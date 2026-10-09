/* =====================================================================
   CAFÉ LOOP · IMÁGENES DINÁMICAS
   ===================================================================== */

const IMAGENES_CONFIG = {
  carpetaMenu: "images/menu/",
  carpetaTienda: "images/tienda/",
  carpetaSitio: "images/entrada/",
  extensiones: ["jpg", "jpeg", "png", "webp"],

  excepciones: {
    "tienda-blend-loop": "tienda-blend-loop.jpg",
    "tienda-taza-loop": "tienda-taza-loop.jpg",
    "tienda-filtro-reutilizable": "tienda-filtro-reutilizable.jpg",

    "tienda-prensa": "tienda-prensa.jpg",

    "tienda-colombia": "tienda-colombia-recortada.jpg",
    "tienda-brasil": "tienda-brasil-recortada.jpg",
    "tienda-descafeinado": "tienda-descafeinado-recortada.jpg",
    "tienda-espresso": "tienda-espresso-recortada.jpg",
    "tienda-dripper": "tienda-dripper.jpg",
    "tienda-molinillo": "tienda-molinillo.jpg",
    "tienda-vaso": "tienda-vaso.jpg",
    "tienda-tote": "tienda-tote.jpg",
  },

  sitio: {
    hero: "tostadoradecafe.png",
    "acceso-tienda": "gato-taza-naranja.webp",
    "acceso-aprende": "gato-taza-rayada.webp",
    destacado: "vaso-cafe-manos.webp",
  },
};

(function () {
  const cfg = IMAGENES_CONFIG;

  function existe(url) {
    return new Promise((resolver) => {
      const prueba = new Image();
      prueba.onload = () => resolver(true);
      prueba.onerror = () => resolver(false);
      prueba.src = url;
    });
  }

  async function buscarImagen(carpeta, id) {
    const candidatos = cfg.excepciones[id]
      ? [carpeta + cfg.excepciones[id]]
      : cfg.extensiones.map((ext) => carpeta + id + "." + ext);

    for (const url of candidatos) {
      if (await existe(url)) return url;
    }

    return null;
  }

  async function cargarFotoTarjeta(tarjeta, contenedor, carpeta) {
    const id = tarjeta.id;

    if (!id || !contenedor || contenedor.querySelector("img")) return true;

    const url = await buscarImagen(carpeta, id);

    if (!url) return false;

    const titulo = tarjeta.querySelector("h3");

    const img = document.createElement("img");
    img.className = "producto-img";
    img.src = url;
    img.alt = titulo ? titulo.textContent.trim() : "";

    contenedor.prepend(img);
    contenedor.classList.add("tiene-imagen");
    contenedor.removeAttribute("aria-hidden");

    return true;
  }

  async function iniciar() {
    const tareas = [];

    document.querySelectorAll(".menu-producto").forEach((tarjeta) => {
      const caja = tarjeta.querySelector(".menu-producto-visual");

      tareas.push(
        cargarFotoTarjeta(tarjeta, caja, cfg.carpetaMenu).then((ok) =>
          ok ? null : cfg.carpetaMenu + tarjeta.id,
        ),
      );
    });

    document.querySelectorAll(".tienda-producto").forEach((tarjeta) => {
      const caja = tarjeta.querySelector(".tienda-visual");

      tareas.push(
        cargarFotoTarjeta(tarjeta, caja, cfg.carpetaTienda).then((ok) =>
          ok ? null : cfg.carpetaTienda + tarjeta.id,
        ),
      );
    });

    document.querySelectorAll("img[data-imagen]").forEach((img) => {
      const archivo = cfg.sitio[img.dataset.imagen];

      if (archivo) {
        img.src = cfg.carpetaSitio + archivo;
      }
    });

    const faltan = (await Promise.all(tareas)).filter(Boolean);

    if (faltan.length) {
      console.info(
        "[Café Loop] Productos sin foto. Revisá estas rutas:\n" +
          faltan.join("\n"),
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();

/* =====================================================================
   CAFÉ LOOP · IMÁGENES DINÁMICAS
   ---------------------------------------------------------------------
   Para cambiar una foto NO hace falta tocar el HTML:
   reemplazá el archivo en la carpeta y recargá con Ctrl + F5.

   CARPETAS
     images/menu/     → fotos de la carta (menu.html)
     images/tienda/   → fotos de la tienda (index.html y tienda.html)
     images/          → fotos generales de la portada

   NOMBRES
   Cada producto busca una imagen con el nombre de su id y prueba las
   extensiones jpg, jpeg, png y webp. Ejemplos:
     images/menu/cafe-espresso.jpg
     images/menu/torta-cheesecake.jpg
     images/tienda/tienda-blend-loop.jpg

   Si una imagen no existe, se sigue viendo el dibujo original.
   Podés cargar las fotos de a poco, sin que nada se rompa.
   ===================================================================== */

const IMAGENES_CONFIG = {
  // Carpetas
  carpetaMenu: 'images/menu/',
  carpetaTienda: 'images/tienda/',
  carpetaSitio: 'images/',

  // Extensiones que se prueban, en orden, para cada producto
  extensiones: ['jpg', 'jpeg', 'png', 'webp'],

  // Excepciones: si una foto tiene otro nombre o extensión, anotala acá.
  // Formato →  'id-del-producto': 'nombre-del-archivo.ext'
  // Ejemplo →  'cafe-espresso': 'espresso-nuevo.webp',
  excepciones: {
    // 'cafe-espresso': 'espresso-nuevo.webp',
  },

  // Imágenes generales de la portada (se usan en index.html)
  // Cambiá el nombre del archivo para usar otra foto.
  sitio: {
    hero: 'tostadoradecafe.png',
    'acceso-tienda': 'gato-taza-naranja.webp',
    'acceso-aprende': 'gato-taza-rayada.webp',
    destacado: 'vaso-cafe-manos.webp',
  },
};

(function () {
  const cfg = IMAGENES_CONFIG;

  // Prueba si una imagen existe y se puede cargar.
  function existe(url) {
    return new Promise((resolver) => {
      const prueba = new Image();
      prueba.onload = () => resolver(true);
      prueba.onerror = () => resolver(false);
      prueba.src = url;
    });
  }

  // Devuelve la primera imagen que exista para ese producto (o null).
  async function buscarImagen(carpeta, id) {
    const candidatos = cfg.excepciones[id]
      ? [carpeta + cfg.excepciones[id]]
      : cfg.extensiones.map((ext) => carpeta + id + '.' + ext);
    for (const url of candidatos) {
      if (await existe(url)) return url;
    }
    return null;
  }

  // Reemplaza el dibujo de una tarjeta por la foto, si la foto existe.
  // Devuelve true si encontró foto.
  async function cargarFotoTarjeta(tarjeta, contenedor, carpeta) {
    const id = tarjeta.id;
    if (!id || !contenedor) return true;
    const url = await buscarImagen(carpeta, id);
    if (!url) return false; // se queda el dibujo

    const titulo = tarjeta.querySelector('h3');
    const img = document.createElement('img');
    img.className = 'producto-img';
    img.src = url;
    img.alt = titulo ? titulo.textContent.trim() : '';
    contenedor.prepend(img);
    contenedor.classList.add('tiene-imagen');
    contenedor.removeAttribute('aria-hidden');
    return true;
  }

  async function iniciar() {
    const tareas = [];

    // Menú
    document.querySelectorAll('.menu-producto').forEach((tarjeta) => {
      const caja = tarjeta.querySelector('.menu-producto-visual');
      tareas.push(
        cargarFotoTarjeta(tarjeta, caja, cfg.carpetaMenu).then((ok) => (ok ? null : cfg.carpetaMenu + tarjeta.id))
      );
    });

    // Tienda (portada y tienda.html)
    document.querySelectorAll('.tienda-producto').forEach((tarjeta) => {
      const caja = tarjeta.querySelector('.tienda-visual');
      tareas.push(
        cargarFotoTarjeta(tarjeta, caja, cfg.carpetaTienda).then((ok) => (ok ? null : cfg.carpetaTienda + tarjeta.id))
      );
    });

    // Imágenes generales del sitio
    document.querySelectorAll('img[data-imagen]').forEach((img) => {
      const archivo = cfg.sitio[img.dataset.imagen];
      if (archivo) img.src = cfg.carpetaSitio + archivo;
    });

    // Aviso en la consola (F12) con las fotos que faltan
    const faltan = (await Promise.all(tareas)).filter(Boolean);
    if (faltan.length) {
      console.info(
        '[Café Loop] Productos sin foto (' + faltan.length + '). Nombre esperado + .jpg/.jpeg/.png/.webp:\n' +
          faltan.join('\n')
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();

# Café Loop — archivos actualizados

Este paquete contiene la portada, la página del menú, la hoja de estilos y el JavaScript actualizado.

## Cómo aplicarlo
1. Hacé una copia de seguridad de tu carpeta actual.
2. Copiá `index.html`, `menu.html`, `style.css` y `script.js` en la carpeta del proyecto, reemplazando los anteriores.
3. Conservá la carpeta `images/` original: las páginas usan las imágenes que ya tenías.
4. Abrí `index.html` con Live Server o en el navegador y recargá con Ctrl + F5.

## Funciones incluidas
- Navegación con accesos diferenciados a Menú, Tienda, Aprendé y Ubicación.
- Botón Comprar destacado en marrón oscuro y crema, sin naranja.
- Tienda de demostración: café en grano, taza y filtro, con agregado al carrito.
- Carta adaptable a celulares con 20 productos y accesos directos a cada bebida.
- Cuestionario de ocho pasos con recomendaciones de bebida y acompañamiento, y agregado al carrito.
- Registro, ingreso y cierre de sesión compartidos entre ambas páginas en este navegador.
- Google Maps interactivo y enlaces para abrir el mapa y obtener indicaciones.
- Formulario de suscripción con confirmación local de demostración.
- Carrito compartido entre la portada y el menú mediante `localStorage`.

Los precios de la tienda son ilustrativos y se pueden cambiar en `index.html`.
El formulario de suscripción muestra una confirmación en pantalla; no envía correos a un servidor.
La dirección Obispo Trejo 850, Nueva Córdoba, y los horarios son ficticios para este proyecto. El mapa apunta a esa dirección.

## Cuenta local
Abrí la web con Live Server (localhost) o HTTPS. La cuenta y sesión se guardan solo en el navegador actual; no se sincronizan entre dispositivos. Las contraseñas se derivan con PBKDF2-SHA-256, sal aleatoria y 210.000 iteraciones, sin guardar la contraseña original. Esta entrega estática no ofrece autenticación de servidor ni protege recursos: para cuentas reales en producción se necesita un backend con sesiones seguras.

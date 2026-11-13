# Café Loop

Proyecto integrador del **Grupo 5** para Taller de Desarrollo Web. Café Loop es una aplicación de cafetería que permite explorar el menú, buscar productos, iniciar sesión y realizar una compra mediante un carrito.

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura](#estructura)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Servicios](#servicios)
- [Publicación](#publicación)

## Descripción

La aplicación conserva la identidad visual de la primera versión de Café Loop y la transforma en una SPA desarrollada con React. Todas las rutas se muestran desde un único `index.html`.

## Funcionalidades

- Inicio con información de la cafetería, productos destacados y ubicación.
- Menú completo con los 20 cafés, productos de pastelería y salados de la versión original.
- Tienda separada con sus 12 productos, imágenes y filtros.
- Buscador y filtros por categoría.
- Carrito con cantidades, eliminación, total y finalización directa.
- Registro e inicio de sesión con validaciones en tiempo real.
- Datos del usuario y del carrito almacenados en localStorage.
- Productos y carrito conectados a una API REST simulada.
- Navegación compatible con GitHub Pages mediante HashRouter.
- Enfoque automático de formularios con ref de React 19, sin forwardRef.
- Mensaje de respaldo cuando la API no está disponible.

## Tecnologías

| Tecnología | Uso |
|---|---|
| React | Componentes y renderizado dinámico |
| Vite | Entorno de desarrollo y compilación |
| React Router | Navegación, rutas hijas y Outlet |
| Bootstrap | Grilla y utilidades responsivas |
| Sass | Variables, mixins y estilos SCSS |
| json-server | Backend simulado |
| Fetch | Solicitudes GET, POST, PATCH y DELETE |

## Estructura

```text
src/
├── api/
├── assets/
├── components/
├── context/
├── data/
├── pages/
├── styles/
└── utils/
```

## Instalación

```bash
npm install
```

## Ejecución

En una terminal:

```bash
npm run api
```

En otra terminal:

```bash
npm run dev
```

La API se ejecuta en `http://localhost:4000`. Vite muestra en la terminal la dirección de la aplicación, normalmente `http://localhost:5173`. Los dos comandos deben permanecer ejecutándose mientras se prueba el proyecto completo.

## Servicios

### Endpoints

- `GET /products`
- `GET /cart`
- `POST /cart`
- `PATCH /cart/:id`
- `DELETE /cart/:id`

## Publicación

Repositorio: [Carta de cafetería G5](https://github.com/Marxkiz/Carta-de-cafeteria-G5)

Sitio: [Café Loop en GitHub Pages](https://marxkiz.github.io/Carta-de-cafeteria-G5/)

La publicación usa GitHub Actions para instalar con `npm ci`, auditar las dependencias, compilar con Vite y desplegar `dist` al actualizar `main`. Los pull requests hacia `main` también ejecutan la auditoría y compilación.

GitHub Pages sirve la versión estática. En esa versión el catálogo se incluye en la aplicación y el carrito se guarda en localStorage. Para demostrar GET, POST, PATCH y DELETE durante el parcial, ejecutar `npm run api` junto con `npm run dev`.

Para conectar una API externa a una compilación, definir `VITE_API_URL` en un archivo `.env` antes de ejecutar `npm run build`. La API debe permitir solicitudes desde el dominio del sitio. En desarrollo se utiliza `http://localhost:4000` de forma predeterminada.

## Comprobación antes de entregar

Usar Node.js 24 o posterior e instalar las versiones del archivo de bloqueo con `npm ci`.

```bash
npm audit --audit-level=high
npm run build
npm run preview
```

Con `npm run api` y `npm run dev` activos, abrir el menú y la tienda, agregar un producto al carrito, cambiar su cantidad, eliminarlo y finalizar una compra. Revisar la consola del navegador y la pestaña Network para confirmar las solicitudes a la API.

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
- Menú completo con cafés, pastelería, salados y productos de tienda.
- Buscador y filtros por categoría.
- Carrito con cantidades, eliminación, total y finalización directa.
- Registro e inicio de sesión con validaciones en tiempo real.
- Datos del usuario y del carrito almacenados en localStorage.
- Productos y carrito conectados a una API REST simulada.

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

La API se ejecuta en `http://localhost:4000`. Vite muestra en la terminal la dirección de la aplicación, normalmente `http://localhost:5173`.

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

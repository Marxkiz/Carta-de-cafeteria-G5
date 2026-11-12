const API_URL = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '')).replace(/\/$/, '')

export const apiDisponible = Boolean(API_URL)

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error('No se pudo completar la solicitud')
  return response.status === 204 ? null : response.json()
}

export async function getProducts() {
  return await request('/products')
}

export async function getCart() {
  return await request('/cart')
}

export async function addCartItem(item) {
  return await request('/cart', { method: 'POST', body: JSON.stringify(item) })
}

export async function updateCartItem(id, changes) {
  return await request(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
}

export async function deleteCartItem(id) {
  return await request(`/cart/${id}`, { method: 'DELETE' })
}

const API_URL = 'http://localhost:4000'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) throw new Error('No se pudo completar la solicitud')
  return response.status === 204 ? null : response.json()
}

export function getProducts() {
  return request('/products')
}

export function getCart() {
  return request('/cart')
}

export function addCartItem(item) {
  return request('/cart', { method: 'POST', body: JSON.stringify(item) })
}

export function updateCartItem(id, changes) {
  return request(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
}

export function deleteCartItem(id) {
  return request(`/cart/${id}`, { method: 'DELETE' })
}

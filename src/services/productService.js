const BASE_URL = 'https://dummyjson.com';

async function request(url, options = {}) {
  try {
    const response = await fetch(BASE_URL + url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed (status ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection.', { cause: error });
    }
    throw error;
  }
}

export async function getProducts() {
  const data = await request('/products?limit=0');
  return data.products;
}

export async function searchProducts(query) {
  const data = await request(`/products/search?q=${encodeURIComponent(query)}&limit=0`);
  return data.products;
}

export async function getCategories() {
  return await request('/products/category-list');
}

export async function getProductsByCategory(category) {
  const data = await request(`/products/category/${encodeURIComponent(category)}?limit=0`);
  return data.products;
}

export async function getProductById(id) {
  return await request(`/products/${id}`);
}

export async function addProduct(product) {
  return await request('/products/add', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return await request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return await request(`/products/${id}`, {
    method: 'DELETE',
  });
}

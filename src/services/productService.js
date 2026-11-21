// All API calls for the dashboard live in this file.
// Components never call fetch() directly - they use these functions.

const BASE_URL = 'https://dummyjson.com';

// Shared helper: sends the request, checks response.ok and returns the JSON.
// If anything fails, it throws an Error with a readable message.
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
    // fetch() itself throws a TypeError when there is no internet connection
    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection.', { cause: error });
    }
    throw error;
  }
}

// GET /products  (limit=0 returns ALL products, so we can paginate with slice())
export async function getProducts() {
  const data = await request('/products?limit=0');
  return data.products;
}

// GET /products/search?q=phone
export async function searchProducts(query) {
  const data = await request(`/products/search?q=${encodeURIComponent(query)}&limit=0`);
  return data.products;
}

// GET /products/category-list  -> ["beauty", "fragrances", ...]
export async function getCategories() {
  return await request('/products/category-list');
}

// GET /products/category/smartphones
export async function getProductsByCategory(category) {
  const data = await request(`/products/category/${encodeURIComponent(category)}?limit=0`);
  return data.products;
}

// GET /products/1
export async function getProductById(id) {
  return await request(`/products/${id}`);
}

// POST /products/add
export async function addProduct(product) {
  return await request('/products/add', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

// PUT /products/1
export async function updateProduct(id, product) {
  return await request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

// DELETE /products/1
export async function deleteProduct(id) {
  return await request(`/products/${id}`, {
    method: 'DELETE',
  });
}

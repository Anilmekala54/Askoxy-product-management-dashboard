# Product Management Dashboard

A responsive product management dashboard built with **React** and **Tailwind CSS**, using the [DummyJSON Products API](https://dummyjson.com/docs/products).

Users can browse products, search, filter by category, view product details, and add, edit and delete products.

---

## Technologies

- **React** (functional components, `useState`, `useEffect`)
- **Vite** (development server and build tool)
- **Tailwind CSS** (styling)
- **Fetch API** (HTTP requests with `async/await`, `try/catch` and `response.ok`)
- **JavaScript (ES6+)**

---

## Features

1. **Product listing**: products fetched from the API with image, title, price, category, rating and stock.
2. **Search**: API-based search (`/products/search`). It waits 500 ms after the user stops typing.
3. **Category filter**: categories are loaded from the API (`/products/category-list`), with an "All Categories" option.
4. **Search + category together**: e.g. search "phone" in "smartphones".
5. **Product details**: a modal loaded from `/products/{id}`.
6. **Pagination**: 10 products per page with Previous / Next buttons.
7. **Add product**: form with validation, sent with `POST`.
8. **Edit product**: the same form, prefilled, sent with `PUT`.
9. **Delete product**: confirmation modal, sent with `DELETE`.
10. **Loading, error and empty states**: spinner, error message with **Retry**, "No products found".
11. **Sidebar**: All Products (clears filters), Add Product, and a category list that filters on click. Always visible on desktop; on mobile it slides in from the ☰ menu button.
12. **Responsive UI**: 1 to 4 column grid, mobile-friendly header, forms and modals.

---

## Folder Structure

```text
src/
  components/
    Sidebar.jsx       # Navigation (All Products, Add Product) + clickable category list
    Header.jsx        # Title, product count, search, category dropdown, Add button, mobile menu button
    ProductCard.jsx   # One product card with View / Edit / Delete buttons
    ProductForm.jsx   # Add / Edit form (one form used for both)
    Pagination.jsx    # Previous / page number / Next
  services/
    productService.js # All API request functions (fetch)
  App.jsx             # State, API calls, search, filtering, pagination, CRUD, modals
  index.css           # Tailwind import + reusable button/input classes
  main.jsx            # React entry point
```

---

## API Endpoints

Base URL: `https://dummyjson.com`

| Requirement | Method | Endpoint | Function |
|---|---|---|---|
| Get products | GET | `/products?limit=0` | `getProducts()` |
| Search | GET | `/products/search?q=phone&limit=0` | `searchProducts(query)` |
| Categories | GET | `/products/category-list` | `getCategories()` |
| Category filter | GET | `/products/category/smartphones?limit=0` | `getProductsByCategory(category)` |
| Product details | GET | `/products/1` | `getProductById(id)` |
| Add | POST | `/products/add` | `addProduct(product)` |
| Edit | PUT | `/products/1` | `updateProduct(id, product)` |
| Delete | DELETE | `/products/1` | `deleteProduct(id)` |

`limit=0` tells DummyJSON to return **all** matching products. This lets the app paginate in the browser with `slice()`.

---

## How Search, Category Filter and Pagination Work Together

DummyJSON has separate endpoints for search and category, but none for both together. The app decides which request to send:

| Search | Category | What the app does |
|---|---|---|
| – | – | `getProducts()` |
| ✔ | – | `searchProducts(query)` |
| – | ✔ | `getProductsByCategory(category)` |
| ✔ | ✔ | `searchProducts(query)`, then `filter()` by category |

Filtering is always done on the **full** result list. **Pagination comes last**:

```js
const userPerPage = 10;
const totalPage = Math.ceil(products.length / userPerPage);
const startIndex = (currentPage - 1) * userPerPage;
const lastIndex = startIndex + userPerPage;
const currentProducts = products.slice(startIndex, lastIndex);
```

- The page resets to 1 when the search or category changes.
- If the last product on a page is deleted, the app moves back to the previous page.
- If an old search response arrives after a newer one, it is ignored.

---

## Installation

Requires Node.js 18 or newer.

```bash
npm install
```

## How to Run

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## How to Build

```bash
npm run build
```

The production files are created in the `dist/` folder. Run `npm run preview` to view the build locally.

---

## DummyJSON CRUD Limitation

DummyJSON **simulates** `POST`, `PUT` and `DELETE` requests. The API returns a successful response, but **the data is not saved on the server**.

So after each successful request, the app updates its local React state:

| Action | API request | Local state update |
|---|---|---|
| Add | `POST /products/add` | `setProducts([newProduct, ...products])` |
| Edit | `PUT /products/{id}` | `products.map()` replaces the edited product |
| Delete | `DELETE /products/{id}` | `products.filter()` removes the product |

Things to know:

- **Changes are lost when the page is refreshed** or when the search or category changes, because the app then loads fresh data from the API.
- DummyJSON returns `id: 195` for every new product, so the app gives new products a unique id with `Date.now()`.
- Products added in the app don't exist on the server (PUT/DELETE would return 404). Editing or deleting them only updates the local state.

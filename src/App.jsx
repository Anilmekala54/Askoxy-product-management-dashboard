import { useEffect, useState } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from './services/productService';

function App() {
  // ---------- Product list ----------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0); // increase this number to fetch again (Retry)

  // ---------- Search and category ----------
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // ---------- Modals ----------
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, product = Edit
  const [selectedProduct, setSelectedProduct] = useState(null); // details modal
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [productToDelete, setProductToDelete] = useState(null); // delete confirmation
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // ---------- Success message ----------
  const [message, setMessage] = useState('');

  // ---------- Sidebar (mobile menu open/closed) ----------
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ---------- Pagination (my pagination code) ----------
  const [currentPage, setCurrentPage] = useState(1);

  const userPerPage = 10;

  const totalPage = Math.ceil(products.length / userPerPage);

  const startIndex = (currentPage - 1) * userPerPage;

  const lastIndex = startIndex + userPerPage;

  const currentProducts = products.slice(startIndex, lastIndex);

  // ---------- Load categories once (and again on Retry) ----------
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]); // dropdown still shows "All Categories"
      }
    }
    loadCategories();
  }, [reload]);

  // ---------- Load products whenever search or category changes ----------
  // Filtering happens HERE, on the full list, before pagination.
  useEffect(() => {
    let ignore = false; // becomes true if a newer request replaces this one
    const query = search.trim();

    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        let result;

        if (query && category) {
          // No API for search + category together:
          // get all search results, then keep only the selected category.
          const searchResults = await searchProducts(query);
          result = searchResults.filter((product) => product.category === category);
        } else if (query) {
          result = await searchProducts(query);
        } else if (category) {
          result = await getProductsByCategory(category);
        } else {
          result = await getProducts();
        }

        if (!ignore) setProducts(result);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    // Wait 500ms after the user stops typing before calling the search API.
    const delay = query ? 500 : 0;
    const timer = setTimeout(loadProducts, delay);

    // Cleanup: runs before the next request. Cancels the timer and ignores
    // the old response so it can never overwrite newer results.
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, category, reload]);

  // ---------- Helpers ----------
  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setCurrentPage(1); // reset page when search changes
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setCurrentPage(1); // reset page when category changes
  }

  // "All Products" in the sidebar: clear search and category.
  function handleShowAll() {
    handleSearchChange('');
    handleCategoryChange('');
  }

  function handleRetry() {
    setReload(reload + 1);
  }

  // ---------- View details ----------
  async function handleView(product) {
    setDetailsError('');

    // Products added or edited in this session only exist in our state,
    // so we show our local copy instead of calling the API.
    if (product.isLocal || product.isEdited) {
      setSelectedProduct(product);
      return;
    }

    setSelectedProduct(product); // open the modal immediately
    setDetailsLoading(true);
    try {
      const data = await getProductById(product.id);
      setSelectedProduct(data);
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeDetails() {
    setSelectedProduct(null);
    setDetailsError('');
  }

  // ---------- Add / Edit ----------
  function handleAddClick() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleEdit(product) {
    setSelectedProduct(null); // close details modal if Edit was clicked there
    setEditingProduct(product);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  // Called by ProductForm after validation passes.
  // If the API call fails, the error is thrown back to the form to display.
  async function handleSave(formData) {
    const productData = {
      title: formData.title.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      thumbnail: formData.image.trim(),
    };

    if (editingProduct) {
      // EDIT: products added in this session don't exist on the server
      // (PUT would return 404), so we only call the API for real products.
      if (!editingProduct.isLocal) {
        await updateProduct(editingProduct.id, productData);
      }

      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...productData, isEdited: true } : product
      );
      setProducts(updatedProducts);
      showMessage('Product updated successfully.');
    } else {
      // ADD: DummyJSON returns id 195 for every new product, so we create
      // our own unique id with Date.now() to avoid duplicate React keys.
      const savedProduct = await addProduct(productData);
      const newProduct = {
        ...savedProduct,
        ...productData,
        id: Date.now(),
        rating: 0,
        stock: 0,
        isLocal: true,
      };

      setProducts([newProduct, ...products]);
      setCurrentPage(1); // new product appears at the top of page 1
      showMessage('Product added successfully.');
    }

    closeForm();
  }

  // ---------- Delete ----------
  function handleDeleteClick(product) {
    setDeleteError('');
    setProductToDelete(product);
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError('');
    try {
      if (!productToDelete.isLocal) {
        await deleteProduct(productToDelete.id);
      }

      const remainingProducts = products.filter((product) => product.id !== productToDelete.id);
      setProducts(remainingProducts);

      // If we deleted the last product on the last page, go back one page.
      const newTotalPage = Math.ceil(remainingProducts.length / userPerPage);
      if (currentPage > newTotalPage) {
        setCurrentPage(Math.max(newTotalPage, 1));
      }

      showMessage(`"${productToDelete.title}" deleted successfully.`);
      setProductToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  // ---------- Empty state text ----------
  let emptyText = 'There are no products to display.';
  if (search.trim() && category) emptyText = `No products match "${search.trim()}" in this category.`;
  else if (search.trim()) emptyText = `No products found for "${search.trim()}".`;
  else if (category) emptyText = 'No products found in this category.';

  return (
    <div className="min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        category={category}
        onCategoryChange={handleCategoryChange}
        onShowAll={handleShowAll}
        onAddClick={handleAddClick}
      />

      {/* On large screens, push the page content right to make room for the sidebar */}
      <div className="lg:pl-64">
        <Header
          search={search}
          onSearchChange={handleSearchChange}
          categories={categories}
          category={category}
          onCategoryChange={handleCategoryChange}
          onAddClick={handleAddClick}
          productCount={products.length}
          loading={loading}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {message && (
            <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div aria-busy="true" className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-12 text-slate-500 shadow-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p>Loading products...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div role="alert" className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="font-semibold text-red-600">Something went wrong</h3>
              <p className="text-slate-500">{error}</p>
              <button className="btn-primary" onClick={handleRetry}>
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="font-semibold text-slate-900">No products found</h3>
              <p className="text-slate-500">{emptyText}</p>
              {(search || category) && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    handleSearchChange('');
                    handleCategoryChange('');
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Product grid + pagination */}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
            </>
          )}
        </main>
      </div>

      {/* Add / Edit form modal */}
      {showForm && (
        <ProductForm product={editingProduct} categories={categories} onSave={handleSave} onCancel={closeForm} />
      )}

      {/* Product details modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={closeDetails}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product Details"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Product Details</h2>
              <button
                className="cursor-pointer px-1 text-3xl leading-none text-slate-400 hover:text-slate-700"
                onClick={closeDetails}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {detailsLoading && (
              <div aria-busy="true" className="flex flex-col items-center gap-3 py-12 text-slate-500">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                <p>Loading details...</p>
              </div>
            )}

            {!detailsLoading && detailsError && (
              <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-red-600">{detailsError}</p>
                <button className="btn-primary" onClick={() => handleView(selectedProduct)}>
                  Retry
                </button>
              </div>
            )}

            {!detailsLoading && !detailsError && (
              <div className="grid gap-6 md:grid-cols-2">
                <img
                  className="h-60 w-full rounded-xl bg-slate-50 object-contain p-4 md:h-80"
                  src={selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                />
                <div className="flex flex-col gap-2.5">
                  <span className="self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-2xl font-semibold text-slate-900">{selectedProduct.title}</h3>
                  <p className="text-2xl font-bold text-blue-600">${Number(selectedProduct.price).toFixed(2)}</p>
                  <p className="text-slate-500">{selectedProduct.description}</p>

                  <ul className="mt-2 grid grid-cols-2 gap-2.5">
                    <DetailItem label="Category" value={selectedProduct.category} />
                    <DetailItem label="Rating" value={`⭐ ${selectedProduct.rating}`} />
                    <DetailItem label="Stock" value={selectedProduct.stock} />
                    {selectedProduct.brand && <DetailItem label="Brand" value={selectedProduct.brand} />}
                    {selectedProduct.discountPercentage > 0 && (
                      <DetailItem label="Discount" value={`${selectedProduct.discountPercentage}%`} />
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className="btn-secondary" onClick={closeDetails}>
                Close
              </button>
              {!detailsLoading && !detailsError && (
                <button className="btn-primary" onClick={() => handleEdit(selectedProduct)}>
                  Edit Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => !deleting && setProductToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Delete Product"
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-semibold">Delete Product</h2>
            <p className="text-slate-500">
              Are you sure you want to delete <strong className="text-slate-800">{productToDelete.title}</strong>?
            </p>
            {deleteError && (
              <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {deleteError}
              </div>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button className="btn-secondary" onClick={() => setProductToDelete(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small box used in the details modal (label on top, value below).
function DetailItem({ label, value }) {
  return (
    <li className="flex flex-col rounded-lg bg-slate-50 px-3 py-2.5">
      <span className="text-xs text-slate-500">{label}</span>
      <strong className="capitalize">{value}</strong>
    </li>
  );
}

export default App;

import { useEffect, useState } from 'react';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import DeleteConfirmation from './components/DeleteConfirmation';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import SuccessMessage from './components/SuccessMessage';
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [message, setMessage] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const userPerPage = 10;

  const totalPage = Math.ceil(products.length / userPerPage);

  const startIndex = (currentPage - 1) * userPerPage;

  const lastIndex = startIndex + userPerPage;

  const currentProducts = products.slice(startIndex, lastIndex);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, [reload]);

  useEffect(() => {
    let ignore = false;
    const query = search.trim();

    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        let result;

        if (query && category) {
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

    const delay = query ? 500 : 0;
    const timer = setTimeout(loadProducts, delay);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search, category, reload]);

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setCurrentPage(1);
  }

  function handleShowAll() {
    handleSearchChange('');
    handleCategoryChange('');
  }

  function handleRetry() {
    setReload(reload + 1);
  }

  async function handleView(product) {
    setDetailsError('');

    if (product.isLocal || product.isEdited) {
      setSelectedProduct(product);
      return;
    }

    setSelectedProduct(product);
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

  function handleAddClick() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleEdit(product) {
    setSelectedProduct(null);
    setEditingProduct(product);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  async function handleSave(formData) {
    const productData = {
      title: formData.title.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      thumbnail: formData.image.trim(),
      stock: Number(formData.quantity),
    };

    if (editingProduct) {
      if (!editingProduct.isLocal) {
        await updateProduct(editingProduct.id, productData);
      }

      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...productData, isEdited: true } : product
      );
      setProducts(updatedProducts);
      showMessage('Product updated successfully.');
    } else {
      const savedProduct = await addProduct(productData);
      const newProduct = {
        ...savedProduct,
        ...productData,
        id: Date.now(),
        rating: 0,
        isLocal: true,
      };

      setProducts([newProduct, ...products]);
      setCurrentPage(1);
      showMessage('Product added successfully.');
    }

    closeForm();
  }

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
          <SuccessMessage message={message} />

          {loading && <Loading message="Loading products..." card />}

          {!loading && error && <ErrorMessage message={error} onRetry={handleRetry} card />}

          {!loading && !error && products.length === 0 && (
            <EmptyState search={search} category={category} onClearFilters={handleShowAll} />
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <ProductList
                products={currentProducts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />

              <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
            </>
          )}
        </main>
      </div>

      {showForm && (
        <ProductForm product={editingProduct} categories={categories} onSave={handleSave} onCancel={closeForm} />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          loading={detailsLoading}
          error={detailsError}
          onClose={closeDetails}
          onEdit={handleEdit}
          onRetry={() => handleView(selectedProduct)}
        />
      )}

      {productToDelete && (
        <DeleteConfirmation
          product={productToDelete}
          deleting={deleting}
          error={deleteError}
          onCancel={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default App;

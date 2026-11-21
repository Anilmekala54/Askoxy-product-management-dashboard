// Header: dashboard title, product count, search box, category dropdown and Add button.
import { Plus } from 'lucide-react';
function Header({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  onAddClick,
  productCount,
  loading,
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          {/* Menu button: only visible on mobile/tablet, opens the sidebar */}
          <button
            className="cursor-pointer rounded-lg p-2 text-2xl leading-none text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Product Management</h1>
            <p id="product-count" className="mt-0.5 text-sm text-slate-500">
              {loading ? 'Loading products...' : `${productCount} products found`}
            </p>
          </div>
          <button className="btn-primary" onClick={onAddClick}>
            <Plus /> Add Product
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            className="input sm:flex-1"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />

          <select
            className="input cursor-pointer capitalize sm:w-56"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;

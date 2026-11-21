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
        <div className="flex items-center justify-between gap-2 sm:gap-4">

          <button
            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-2xl leading-none text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg leading-tight font-bold text-slate-900 sm:text-xl">Product Management</h1>
            <p id="product-count" className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              {loading ? 'Loading products...' : `${productCount} products found`}
            </p>
          </div>

          <button className="btn-primary shrink-0 gap-1.5 px-3 sm:px-4" onClick={onAddClick} aria-label="Add Product">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
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

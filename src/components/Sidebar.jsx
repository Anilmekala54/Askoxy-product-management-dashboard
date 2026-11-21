// Sidebar: navigation + category list.
// - Desktop (lg and up): always visible on the left.
// - Mobile/tablet: hidden, slides in when the menu button in the Header is clicked.
import { Plus , PackagePlus  } from 'lucide-react';
function Sidebar({ isOpen, onClose, categories, category, onCategoryChange, onShowAll, onAddClick }) {
  // Run the action, then close the menu (only matters on mobile).
  function handleClick(action) {
    action();
    onClose();
  }

  return (
    <>
      {/* Dark background behind the menu on mobile. Clicking it closes the menu. */}
      {isOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose}></div>}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white">
             <img src="/askoxy-logo.png" alt="Askoxy Logo"  />
            </span>
            <span className="font-semibold text-slate-900">Askoxy Products</span>
          </div>
          <button
            className="cursor-pointer px-1 text-3xl leading-none text-slate-400 hover:text-slate-700 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {/* Main menu */}
          <p className="px-3 pt-2 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Menu</p>
          <button
            className={`mb-1 w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
              category === '' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => handleClick(onShowAll)}
          >
            <div className='flex gap-2'><PackagePlus /> <p>All Products</p></div>
          </button>
          <button
            className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
            onClick={() => handleClick(onAddClick)}
          >
           <div className='flex '><Plus /> <span>Add Product</span> </div>
          </button>

          {/* Category list - clicking one filters the products */}
          <p className="px-3 pt-6 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Categories</p>
          {categories.map((item) => (
            <button
              key={item}
              className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm capitalize ${
                category === item ? 'bg-blue-50 font-medium text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => handleClick(() => onCategoryChange(item))}
            >
              {item.replaceAll('-', ' ')}
            </button>
          ))}
        </nav>

        <p className="border-t border-slate-200 p-4 text-xs text-black font-bold">
          Log Out
        </p>
      </aside>
    </>
  );
}

export default Sidebar;

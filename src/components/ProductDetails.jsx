import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

function ProductDetails({ product, loading, error, onClose, onEdit, onRetry }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
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
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {loading && <Loading message="Loading details..." />}

        {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2">
            <img
              className="h-60 w-full rounded-xl bg-slate-50 object-contain p-4 md:h-80"
              src={product.thumbnail}
              alt={product.title}
            />
            <div className="flex flex-col gap-2.5">
              <span className="self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
                {product.category}
              </span>
              <h3 className="text-2xl font-semibold text-slate-900">{product.title}</h3>
              <p className="text-2xl font-bold text-blue-600">${Number(product.price).toFixed(2)}</p>
              <p className="text-slate-500">{product.description}</p>

              <ul className="mt-2 grid grid-cols-2 gap-2.5">
                <DetailItem label="Category" value={product.category} />
                <DetailItem label="Rating" value={`⭐ ${product.rating}`} />
                <DetailItem label="Stock" value={product.stock} />
                {product.brand && <DetailItem label="Brand" value={product.brand} />}
                {product.discountPercentage > 0 && (
                  <DetailItem label="Discount" value={`${product.discountPercentage}%`} />
                )}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {!loading && !error && (
            <button className="btn-primary" onClick={() => onEdit(product)}>
              Edit Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <li className="flex flex-col rounded-lg bg-slate-50 px-3 py-2.5">
      <span className="text-xs text-slate-500">{label}</span>
      <strong className="capitalize">{value}</strong>
    </li>
  );
}

export default ProductDetails;

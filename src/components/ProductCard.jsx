import { useState } from 'react';

function ProductCard({ product, onView, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-lg">
      <div className="relative flex h-48 items-center justify-center bg-slate-50">
        {imageError || !product.thumbnail ? (
          <span className="text-sm text-slate-400">No image</span>
        ) : (
          <img
            className="h-full w-full object-contain p-3"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
        {(product.isLocal || product.isEdited) && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            {product.isLocal ? 'New' : 'Edited'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
          {product.category}
        </span>
        <h3 className="line-clamp-2 min-h-11 font-semibold text-slate-900">{product.title}</h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
          <span className="text-sm text-slate-500">⭐ {product.rating}</span>
        </div>

        <p className={`text-sm font-medium ${product.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
          Stock: {product.stock}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button className="btn-secondary w-full" onClick={() => onView(product)}>
            View Details
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="btn border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>
            <button
              className="btn border-red-200 bg-white text-red-600 hover:bg-red-50"
              onClick={() => onDelete(product)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;

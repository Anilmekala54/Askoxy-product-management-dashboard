import { useState } from 'react';

// ProductForm: one form used for both Add and Edit.
// - Add:  product is null, so the fields start empty.
// - Edit: product is passed in, so the fields start with its values.
function ProductForm({ product, categories, onSave, onCancel }) {
  const isEdit = product !== null;

  const [formData, setFormData] = useState({
    title: product ? product.title : '',
    price: product ? String(product.price) : '',
    description: product ? product.description : '',
    category: product ? product.category : '',
    image: product ? product.thumbnail : '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // One change handler for every input, using the input's "name".
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // clear the error while typing
  }

  // Basic validation. Returns an object like { title: 'Title is required' }.
  function validate() {
    const newErrors = {};

    if (formData.title.trim() === '') newErrors.title = 'Title is required';

    if (formData.price === '') newErrors.price = 'Price is required';
    else if (Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';

    if (formData.description.trim() === '') newErrors.description = 'Description is required';

    if (formData.category === '') newErrors.category = 'Please select a category';

    if (formData.image.trim() === '') newErrors.image = 'Image URL is required';
    else if (!formData.image.trim().startsWith('http')) newErrors.image = 'Image URL must start with http';

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if there are errors

    setSaving(true);
    setSaveError('');
    try {
      await onSave(formData); // App.jsx sends the API request and closes the form
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
  }

  // Make sure the product's category is in the dropdown when editing.
  const categoryOptions =
    formData.category && !categories.includes(formData.category)
      ? [formData.category, ...categories]
      : categories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => !saving && onCancel()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit Product' : 'Add Product'}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button className="cursor-pointer px-1 text-3xl leading-none text-slate-400 hover:text-slate-700" onClick={onCancel} disabled={saving} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {saveError && (
            <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {saveError}
            </div>
          )}

          <div className="mb-4 flex-1">
            <label htmlFor="title" className="mb-1.5 block text-sm font-semibold">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              className={errors.title ? 'input border-red-500' : 'input'}
              value={formData.title}
              onChange={handleChange}
              placeholder="Product title"
            />
            {errors.title && <p id="title-error" className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <div className="mb-4 flex-1">
              <label htmlFor="price" className="mb-1.5 block text-sm font-semibold">Price ($)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className={errors.price ? 'input border-red-500' : 'input'}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.price && <p id="price-error" className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="mb-4 flex-1">
              <label htmlFor="category" className="mb-1.5 block text-sm font-semibold">Category</label>
              <select
                id="category"
                name="category"
                className={errors.category ? 'input cursor-pointer capitalize border-red-500' : 'input cursor-pointer capitalize'}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll('-', ' ')}
                  </option>
                ))}
              </select>
              {errors.category && <p id="category-error" className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div className="mb-4 flex-1">
            <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className={errors.description ? 'input resize-y border-red-500' : 'input resize-y'}
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
            />
            {errors.description && <p id="description-error" className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="mb-4 flex-1">
            <label htmlFor="image" className="mb-1.5 block text-sm font-semibold">Image URL</label>
            <input
              id="image"
              name="image"
              type="text"
              className={errors.image ? 'input border-red-500' : 'input'}
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
            {errors.image && <p id="image-error" className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;

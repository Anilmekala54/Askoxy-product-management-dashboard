function EmptyState({ search, category, onClearFilters }) {
  const query = search.trim();

  let emptyText = 'There are no products to display.';
  if (query && category) emptyText = `No products match "${query}" in this category.`;
  else if (query) emptyText = `No products found for "${query}".`;
  else if (category) emptyText = 'No products found in this category.';

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-12 text-center shadow-sm">
      <h3 className="font-semibold text-slate-900">No products found</h3>
      <p className="text-slate-500">{emptyText}</p>
      {(search || category) && (
        <button className="btn-secondary" onClick={onClearFilters}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;

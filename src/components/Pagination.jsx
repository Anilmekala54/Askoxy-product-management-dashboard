function Pagination({ currentPage, totalPage, setCurrentPage }) {
  return (
    <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
      <button
        className="btn-secondary"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Previous
      </button>

      <span className="min-w-16 text-center font-semibold">
        {currentPage} / {totalPage}
      </span>

      <button
        className="btn-secondary"
        disabled={currentPage === totalPage || totalPage === 0}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;

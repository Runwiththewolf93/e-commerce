export default function CategoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginationDefault =
    "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const paginationActive =
    "flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";

  return (
    <nav aria-label="Page navigation">
      <ul className="inline-flex -space-x-px text-base h-10">
        <li>
          <button
            className={paginationDefault}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              className={
                currentPage === number ? paginationActive : paginationDefault
              }
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            className={paginationDefault}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

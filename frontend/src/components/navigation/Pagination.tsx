interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center mt-8 flex-wrap gap-2"
    >
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            p === page
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800 hover:bg-gray-200"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </nav>
  );
}

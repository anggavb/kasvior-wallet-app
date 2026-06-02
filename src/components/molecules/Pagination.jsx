/**
 * Pagination — komponen navigasi halaman untuk tabel/list.
 * Digunakan di History.
 *
 * @param {Object} props
 * @param {number} props.total - Total jumlah item.
 * @param {number} props.perPage - Jumlah item per halaman.
 * @param {number} props.current - Halaman saat ini (1-based).
 * @param {function} [props.onChange] - Callback saat halaman berubah.
 * @returns {JSX.Element}
 */
function Pagination({ total, perPage, current, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  const startItem = total === 0 ? 0 : (current - 1) * perPage + 1;
  const endItem = Math.min(current * perPage, total);

  const handlePage = (page) => {
    if (page < 1 || page > totalPages) return;
    onChange?.(page);
  };

  return (
    <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">
        Show {startItem}–{endItem} of {total} History
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => handlePage(current - 1)}
          disabled={current === 1}
          className="rounded-md px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePage(page)}
            className={`min-w-8 rounded-md px-2.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              page === current
                ? "bg-blue-600 font-semibold text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-neutral-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePage(current + 1)}
          disabled={totalPages === 0 || current === totalPages}
          className="rounded-md px-3 py-1.5 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;

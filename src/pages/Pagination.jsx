import "./Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {

    if (totalPages <= 1) return null;

    const getPages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [1];

        if (page > 3) pages.push("...");

        const start = Math.max(2, page - 1);
        const end   = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <div className="pagination-wrap">

            {/* PREVIOUS */}
            <button
                className="pg-btn pg-arrow"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                title="Previous page"
            >
                ‹ Prev
            </button>

            {/* PAGE NUMBERS */}
            {pages.map((p, i) =>
                p === "..." ? (
                    <button key={`dots-${i}`} className="pg-btn pg-dots" disabled>
                        ···
                    </button>
                ) : (
                    <button
                        key={p}
                        className={`pg-btn${p === page ? " active" : ""}`}
                        onClick={() => p !== page && onPageChange(p)}
                    >
                        {p}
                    </button>
                )
            )}

            {/* PAGE INFO */}
            <span className="pg-info">{page} / {totalPages}</span>

            {/* NEXT */}
            <button
                className="pg-btn pg-arrow"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                title="Next page"
            >
                Next ›
            </button>

        </div>
    );
}

export default Pagination;

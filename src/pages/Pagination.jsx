import React from "react";
import "./Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {

    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (page > 3) {
            pages.push("...");
        }

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">

            {/* PREVIOUS */}
            <button
                className="btn btn-light"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                ←
            </button>

            {/* PAGE NUMBERS */}
            {pages.map((p, i) => (

                p === "..." ? (
                    <span key={i} className="px-2">...</span>
                ) : (
                    <button
                        key={i}
                        className={`btn ${p === page ? "btn-primary" : "btn-light"}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                )

            ))}

            {/* NEXT */}
            <button
                className="btn btn-light"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                →
            </button>

        </div>
    );
}

export default Pagination;
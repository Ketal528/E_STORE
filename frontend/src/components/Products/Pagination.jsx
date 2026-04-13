import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center my-8 gap-2">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-md transition-colors ${
            currentPage === page ? "bg-black text-white" : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
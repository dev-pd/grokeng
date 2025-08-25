// components/common/Pagination.tsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  const canGoPrevious = currentPage > 1 && !disabled;
  const canGoNext = currentPage < totalPages && !disabled;

  return (
    <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
      <button
        className="btn-outline flex items-center"
        disabled={!canGoPrevious}
        onClick={() => canGoPrevious && onPageChange(currentPage - 1)}>
        <ChevronLeftIcon className="h-4 w-4 mr-2" />
        Previous
      </button>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        {/* Optional: Add page numbers for better navigation */}
        {totalPages <= 7 ? (
          // Show all pages if 7 or fewer
          <div className="flex space-x-1 ml-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 text-sm rounded ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => !disabled && onPageChange(page)}
                disabled={disabled}>
                {page}
              </button>
            ))}
          </div>
        ) : (
          // Show condensed pagination for many pages
          <div className="flex space-x-1 ml-4">
            {currentPage > 3 && (
              <>
                <button
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => !disabled && onPageChange(1)}
                  disabled={disabled}>
                  1
                </button>
                {currentPage > 4 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm rounded ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => !disabled && onPageChange(page)}
                  disabled={disabled}>
                  {page}
                </button>
              );
            })}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => !disabled && onPageChange(totalPages)}
                  disabled={disabled}>
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <button
        className="btn-outline flex items-center"
        disabled={!canGoNext}
        onClick={() => canGoNext && onPageChange(currentPage + 1)}>
        Next
        <ChevronRightIcon className="h-4 w-4 ml-2" />
      </button>
    </div>
  );
};

export default Pagination;

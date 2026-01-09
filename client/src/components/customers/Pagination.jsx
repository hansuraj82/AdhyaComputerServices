import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3 mt-4 border-t border-slate-100/60">
      {/* Page Info - Left Side */}
      <div className="hidden sm:block">
        <p className="text-sm text-slate-500 font-medium">
          Showing page <span className="text-slate-900 font-bold">{page}</span> of{" "}
          <span className="text-slate-900 font-bold">{totalPages}</span>
        </p>
      </div>

      {/* Navigation Controls - Right Side */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="cursor-pointer group flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed active:scale-95"
        >
          <MdChevronLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
          <span>Previous</span>
        </button>

        {/* Small Desktop Detail: Page Numbers or Indicator */}
        <div className="flex h-9 min-w-[36px] items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 px-3 text-sm font-bold text-indigo-600 shadow-sm shadow-indigo-100">
          {page}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="cursor-pointer group flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed active:scale-95"
        >
          <span>Next</span>
          <MdChevronRight className="text-lg group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
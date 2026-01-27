import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // 🔹 Added for Portal
import { MdOutlineReportProblem, MdDeleteForever, MdOutlineClose } from "react-icons/md";

export default function ConfirmModal({ open, onClose, onConfirm, loading, message, trash = false }) {
  const modalRef = useRef(null);

  // 🔹 Focus Trap & Accessibility
  useEffect(() => {
    if (!open) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    setTimeout(() => firstElement?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose();

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // 🔹 Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset"; // 🔹 Restore scrolling
    };
  }, [open, onClose, loading]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  // 🔹 Wrap in createPortal to ensure it renders at the root of the document
  return createPortal(
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-[0_30px_60px_-15px_rgba(220,38,38,0.3)] overflow-hidden border border-red-100 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger Header */}
        <div className="bg-rose-50 p-8 flex flex-col items-center text-center relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer absolute top-4 right-4 text-rose-300 hover:text-rose-600 disabled:hidden transition-colors"
          >
            <MdOutlineClose size={24} />
          </button>

          <div className="w-16 h-16 bg-white text-rose-600 rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-rose-100">
            <MdOutlineReportProblem size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Security Override
          </h3>
          <p className="text-[11px] font-bold text-rose-500 uppercase tracking-[0.2em] mt-1">
            Destructive Action
          </p>
        </div>

        <div className="p-8">
          <p className="text-sm font-medium text-slate-600 text-center leading-relaxed">
            {message || "Are you sure you want to proceed with this deletion?"}
            <span className="block mt-2 text-rose-600 font-bold italic">
              {trash ? "This record will be moved to Recycle Bin. You can restore it later." : "This process is permanent and cannot be reversed."}
            </span>
          </p>

          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="cursor-pointer w-full py-4 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MdDeleteForever className="text-lg group-hover:animate-bounce" />
                  Confirm Deletion
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel Request
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            Admin Authorization Required
          </p>
        </div>
      </div>
    </div>,
    document.body // 🔹 Renders the modal directly into the body
  );
}
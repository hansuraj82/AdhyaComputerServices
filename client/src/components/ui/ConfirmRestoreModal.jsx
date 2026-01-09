import { useEffect, useRef } from "react";
import { MdSettingsBackupRestore, MdOutlineInfo } from "react-icons/md";

export default function ConfirmRestoreModal({
  open,
  count,
  onConfirm,
  onCancel,
  loading = false,
}) {
  const modalRef = useRef(null);

  // 🔹 Focus Trapping & Accessibility Logic
  useEffect(() => {
    if (!open) return;

    const modalElement = modalRef.current;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Auto-focus the primary action button for better UX
    setTimeout(() => lastElement?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel();

      if (e.key === "Tab") {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all"
      onClick={() => !loading && onCancel()}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200"
      >
        {/* 🔹 Action Header Decor */}
        <div className="bg-emerald-50 p-8 flex flex-col items-center text-center border-b border-emerald-100/50">
          <div className="w-16 h-16 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-emerald-100">
            <MdSettingsBackupRestore size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Restore System Access
          </h2>
        </div>

        <div className="p-8">
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
            <MdOutlineInfo className="text-indigo-500 shrink-0 mt-0.5" size={20} />
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Confirming this action will restore <strong>{count > 1 ? `${count} customers` : "the selected customer"}</strong>.
              They will regain full access to system nodes immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="cursor-pointer flex-1 px-6 py-3.5 rounded-xl font-bold text-[13px] text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              Discard
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3.5 rounded-xl font-bold text-[13px] bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing
                </>
              ) : (
                "Commit Restore"
              )}
            </button>
          </div>
        </div>

        {/* 🔹 Security Footer */}
        <div className="px-8 py-4 bg-slate-50/50 text-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Secure Protocol Recovery Mode
          </p>
        </div>
      </div>
    </div>
  );
}
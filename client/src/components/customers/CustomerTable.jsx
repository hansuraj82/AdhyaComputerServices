import { useEffect, useRef } from "react";
import CustomerRow from "./CustomerRow";
import { MdOutlineClose, MdDeleteSweep, MdChecklist } from "react-icons/md";

export default function CustomerTable({
  customers,
  selectedIds,
  selectedCount,
  onSelect,
  onSelectAll,
  onUnselectAll,
  isAllSelected,
  isSomeSelected,
  setTrashId,
  onBulkTrash
}) {
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected && !isAllSelected;
    }
  }, [isSomeSelected, isAllSelected]);

  return (
    <div className="relative">

      {/* 🔹 Extraordinary Selection Toolbar (Floating) */}
      {selectedCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-indigo-500/20 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
            <div className="bg-indigo-500 h-6 w-6 rounded-full flex items-center justify-center text-[12px] font-bold">
              {selectedCount}
            </div>
            <span className="text-sm font-medium tracking-wide">Item{selectedCount > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBulkTrash}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <MdDeleteSweep size={20} />
              <span>Bulk Trash</span>
            </button>

            <button
              onClick={onUnselectAll}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <MdOutlineClose size={20} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Table Header (Modernized) */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 rounded-t-xl border-x border-t border-slate-200">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => (e.target.checked ? onSelectAll() : onUnselectAll())}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            {isAllSelected ? "Unelect All" : "Selection"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <MdChecklist size={20} />
          <span className="text-xs font-medium uppercase">{customers.length} Total Records</span>
        </div>
      </div>

      {/* 🔹 Body (Scrollable Container) */}
      <div className="border-x border-b border-slate-200 rounded-b-xl bg-white p-4">
        {/* We use the "Hybrid-Card" rows inside here */}
        <div className="space-y-1">
          {customers.map((c) => (
            <CustomerRow
              key={c._id}
              customer={c}
              isSelected={selectedIds.includes(c._id)}
              onSelect={onSelect}
              setTrashId={setTrashId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
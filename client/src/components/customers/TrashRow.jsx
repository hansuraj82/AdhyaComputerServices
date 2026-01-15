import { MdSettingsBackupRestore, MdDeleteForever, MdOutlineHistory } from "react-icons/md";

export default function TrashRow({ customer, isSelected, onSelect, onRestore, onPermanentDelete }) {
  const deletedDate = new Date(customer.deletedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className={`
      group flex items-center gap-4 px-4 py-3 mb-2 bg-white border rounded-xl transition-all duration-200
      ${isSelected ? "border-amber-500 ring-1 ring-amber-500 bg-amber-50/10" : "border-slate-200 hover:border-slate-300"}
    `}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(customer._id)}
        className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
      />

      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 truncate">{customer.name}</span>
          <span className="text-[11px] text-slate-400 font-medium">{customer.mobile}</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-500">
          <MdOutlineHistory size={16} className="text-slate-400" />
          <span className="text-[13px]">Deleted on {deletedDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 ease-out">

        {/* Restore Action */}
        <button
          onClick={() => onRestore(customer._id)}
          className="group/btn relative p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] rounded-xl transition-all active:scale-90 cursor-pointer"
        >
          <MdSettingsBackupRestore size={18} className="group-hover/btn:rotate-[-45deg] transition-transform duration-300" />

          {/* Floating Tooltip Label */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-[10px] text-white font-bold rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
            Restore
          </span>
        </button>

        {/* Permanent Delete Action */}
        <button
          onClick={() => onPermanentDelete(customer._id)}
          className="group/btn relative p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:shadow-[0_4px_12px_rgba(244,63,94,0.15)] rounded-xl transition-all active:scale-90 cursor-pointer"
        >
          <MdDeleteForever size={18} className="group-hover/btn:scale-110 transition-transform" />

          {/* Floating Tooltip Label */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-rose-600 text-[10px] text-white font-bold rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">
            Delete
          </span>
        </button>

      </div>
    </div>
  );
}
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

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onRestore(customer._id)}
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
          title="Restore"
        >
          <MdSettingsBackupRestore size={20} />
        </button>
        <button
          onClick={() => onPermanentDelete(customer._id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Permanently"
        >
          <MdDeleteForever size={20} />
        </button>
      </div>
    </div>
  );
}
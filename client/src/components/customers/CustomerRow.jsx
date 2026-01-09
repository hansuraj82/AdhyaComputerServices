import { MdDeleteOutline, MdPhone, MdLocationOn, MdFingerprint, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function CustomerRow({
  customer,
  isSelected,
  onSelect,
  setTrashId
}) {
  const navigate = useNavigate();
  const goToDetails = () => navigate(`/customers/${customer._id}`);

  return (
    <div
      className={`
        group relative flex items-center gap-4 px-4 py-3 mb-2 
        bg-white border rounded-xl transition-all duration-200
        ${isSelected
          ? "border-indigo-500 ring-1 ring-indigo-500 shadow-sm"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50"
        }
      `}
    >
      {/* 1. Selection Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(customer._id)}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      {/* 2. Customer Avatar/Icon - Adds a 'Premium' feel */}
      <div
        onClick={goToDetails}
        className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 shrink-0 cursor-pointer"
      >
        {customer.name.charAt(0).toUpperCase()}
      </div>

      {/* 3. Primary Info Group */}
      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Name Column */}
        <div className="flex flex-col">
          <span
            onClick={goToDetails}
            className="text-sm font-bold text-slate-900 truncate cursor-pointer hover:text-indigo-600"
          >
            {customer.name}
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
            Created On: : {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Mobile Column */}
        <div className="hidden sm:flex items-center gap-2 text-slate-600">
          <MdPhone className="text-slate-400" size={16} />
          <span className="text-[13px] font-medium">{customer.mobile}</span>
        </div>

        {/* Aadhaar Column */}
        <div className="hidden lg:flex items-center gap-2 text-slate-600">
          <MdFingerprint className="text-slate-400" size={16} />
          <span className="text-[13px] font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {customer.aadhar ? `•••• ${customer.aadhar.slice(-4)}` : "—"}
          </span>
        </div>

        {/* Location Column */}
        <div className="hidden xl:flex items-center gap-2 text-slate-500">
          <MdLocationOn className="text-slate-400" size={16} />
          <span className="text-[13px] truncate">{customer.address}</span>
        </div>
      </div>

      {/* 4. Action Group */}
      <div className="flex items-center gap-1 pl-4 border-l border-slate-100">
        <button
          onClick={() => setTrashId(customer._id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete"
        >
          <MdDeleteOutline size={20} />
        </button>

        <button
          onClick={goToDetails}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
        >
          <MdChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
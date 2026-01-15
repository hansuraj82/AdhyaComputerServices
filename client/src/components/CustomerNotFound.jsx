import { useNavigate } from "react-router-dom";
import { MdOutlinePersonOff, MdArrowBack, MdSearch, MdHome } from "react-icons/md";

export default function CustomerNotFound({ message = "The requested identity node could not be located in the database." }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* 🔹 Visual Icon Section */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-rose-100 rounded-3xl rotate-6 animate-pulse"></div>
          <div className="relative bg-white border-2 border-rose-100 rounded-3xl w-full h-full flex items-center justify-center text-rose-500 shadow-sm">
            <MdOutlinePersonOff size={48} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white p-1.5 rounded-lg shadow-lg">
            <MdSearch size={20} />
          </div>
        </div>

        {/* 🔹 Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Identity Not Found
          </h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed px-6">
            {message} It may have been moved, deleted, or the ID provided is malformed.
          </p>
        </div>

        {/* 🔹 Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Error Code: 404_NULL_NODE</span>
        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-bold text-[12px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <MdArrowBack /> Go Back
          </button>
          
          <button
            onClick={() => navigate("/customers")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold text-[12px] uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
          >
            <MdHome /> Customer List
          </button>
        </div>

        {/* 🔹 Subtle Hint */}
        <p className="text-[11px] text-slate-400 font-medium italic">
          Tip: Verify the URL parameters or check the Recycle Bin (Trash).
        </p>
      </div>
    </div>
  );
}
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineExplore, MdOutlineArrowBack, MdOutlineSpaceDashboard } from "react-icons/md";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">
      {/* 🔹 Background Decoration: Large "404" Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[25vw] font-black text-slate-50 opacity-[0.03] leading-none">
          404
        </h1>
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* 🔹 Icon Backdrop */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] mb-8 animate-pulse">
          <MdOutlineExplore size={48} />
        </div>

        {/* 🔹 Text Content */}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
          Lost in the Vault?
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed mb-10 px-4">
          The resource you are looking for has been moved, archived, or never existed in our database.
        </p>

        {/* 🔹 Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center px-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <MdOutlineArrowBack /> GO BACK
          </button>

          <NavLink
            to="/customers"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95"
          >
            <MdOutlineSpaceDashboard size={18} /> RETURN TO DASHBOARD
          </NavLink>
        </div>

        {/* 🔹 Technical Trace (Optional Footer) */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Error Code: 0x404_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
}
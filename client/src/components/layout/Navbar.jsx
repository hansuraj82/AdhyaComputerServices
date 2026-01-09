import { MdMenu, MdOutlineKeyboardArrowRight, MdOutlineNotificationsNone } from "react-icons/md";
import LogOutBtn from "../ui/LogOutBtn";

export default function Navbar({ onToggleSidebar, onLogout }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">

      {/* 🔹 Left: Breadcrumbs Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          <MdMenu className="text-2xl" />
        </button>

        <nav className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Adhya Computer</span>
          <MdOutlineKeyboardArrowRight className="text-slate-300" />
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">
            Dashboard <span className="text-indigo-500 text-[10px] ml-1 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">Live</span>
          </h1>
        </nav>
      </div>

      {/* 🔹 Right: System & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon (Standard in Pro Apps) */}
        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors relative">
          <MdOutlineNotificationsNone size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">
              Admin
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Node</span>
            </div>
          </div>

          {/* Logout Trigger */}
          <div className="flex items-center">
            <LogOutBtn onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}
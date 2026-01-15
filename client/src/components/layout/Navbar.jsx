import { MdMenu, MdOutlineKeyboardArrowRight, MdOutlineNotificationsNone } from "react-icons/md";
import LogOutBtn from "../ui/LogOutBtn";
import { useEffect, useState } from "react";
import { getOwnerEmailApi } from "../../services/auth.service";

export default function Navbar({ onToggleSidebar, onLogout }) {
  const [ownerEmail, setOwnerEmail] = useState("admin@system");

  useEffect(() => {
    let isMounted = true; // 🔹 Prevents state updates on unmounted component

    const getEmail = async () => {
      try {
        const res = await getOwnerEmailApi();
        // 🔹 Use optional chaining to safely access nested data
        const email = res?.data?.owner?.[0]?.email;
        
        if (isMounted && email) {
          setOwnerEmail(email);
        }
      } catch (error) {
        console.error("Identity Fetch Error:", error);
      }
    };

    getEmail();
    return () => { isMounted = false; }; // 🔹 Cleanup function
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* 🔹 Left: Breadcrumbs Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="cursor-pointer md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          <MdMenu className="text-2xl" />
        </button>

        <nav className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Adhya Computer</span>
          <MdOutlineKeyboardArrowRight className="text-slate-300" />
          <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Dashboard 
            <span className="flex items-center gap-1 text-indigo-500 text-[9px] font-black bg-indigo-50/50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-tighter">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
              Live
            </span>
          </h1>
        </nav>
      </div>

      {/* 🔹 Right: System & User Profile */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
          <MdOutlineNotificationsNone size={22} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-4">
          {/* Identity Node Display */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2.5 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[11px] font-bold text-slate-600 lowercase tracking-tight">
                {ownerEmail}
              </span>
            </div>
          </div>

          <div className="flex items-center pl-2">
            <LogOutBtn onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}
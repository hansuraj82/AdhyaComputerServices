import { useEffect, useState } from "react";
import {
  MdMenu,
  MdOutlineNotifications,
  MdOutlineKeyboardArrowRight,
  MdShield
} from "react-icons/md";
import LogOutBtn from "../ui/LogOutBtn";
import { getOwnerEmailApi } from "../../services/auth.service";
import NotificationDropdown from "../../pages/notifications/NotificationDropdown";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar({ onToggleSidebar, onLogout }) {
  const [ownerEmail, setOwnerEmail] = useState("admin@system");
  const [showNotifications, setShowNotifications] = useState(false);
  const { count } = useNotifications();

  useEffect(() => {
    let isMounted = true;
    const getEmail = async () => {
      try {
        const res = await getOwnerEmailApi();
        const email = res?.data?.owner?.[0]?.email;
        if (isMounted && email) setOwnerEmail(email);
      } catch (error) {
        console.error("Identity Fetch Error:", error);
      }
    };
    getEmail();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">

        {/* LEFT: Contextual Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all md:hidden"
          >
            <MdMenu size={24} />
          </button>

          <nav className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                Adhya
              </span>
              <MdOutlineKeyboardArrowRight className="text-slate-300" />
            </div>

            <div className="flex items-center gap-2.5">
              <h1 className="text-sm font-black text-slate-900 tracking-tight">
                Dashboard
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100/50">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Live</span>
              </div>
            </div>
          </nav>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Notification Engine */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl transition-all duration-200 relative group cursor-pointer ${showNotifications
                  ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
            >
              <MdOutlineNotifications size={24} />

              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center bg-rose-500 text-white text-[10px] font-black rounded-full ring-4 ring-white shadow-lg animate-in zoom-in">
                  {count > 100 ? "100+" : count}
                </span>
              )}
            </button>

            {/* Dropdown Positioning */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 transform origin-top-right transition-all">
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-slate-200/60 mx-1 hidden sm:block" />

          {/* User Profile Identity */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end gap-0.5">

              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100 transition-colors hover:border-slate-200">
                <MdShield className="text-indigo-500" size={12} />
                <span className="text-[11px] font-bold text-slate-600 lowercase tracking-tight">
                  {ownerEmail}
                </span>
              </div>
            </div>

            <div className="flex items-center pl-1 border-l border-slate-100 ml-1">
              <LogOutBtn onLogout={onLogout} />
            </div>
          </div>

        </div>
      </header>
    </>
  );
}


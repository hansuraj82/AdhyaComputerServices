import { NavLink } from "react-router-dom";
import {
  MdPeople,
  MdDeleteOutline,
  MdPersonAddAlt,
  MdLockOutline,
  MdOutlineMail,
  MdOutlineReceiptLong,
  MdOutlinePolicy,
  MdOutlineAnalytics,
  MdOutlineSupportAgent
} from "react-icons/md";

export default function Sidebar({ isOpen, onClose }) {
  const base =
    "fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-200 " +
    "transition-transform duration-300 ease-in-out md:static md:translate-x-0 pt-16 md:pt-6";

  const linkBase =
    "group flex items-center gap-3 px-4 py-2.5 mx-3 rounded-xl text-[13px] font-bold " +
    "transition-all duration-200 ease-in-out antialiased ";

  const getLinkStyles = (isActive) =>
    isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-1 ring-indigo-700/10"
      : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm";

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden z-30 transition-opacity"
        />
      )}

      <aside className={`${base} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">

          <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar pb-6">

            {/* GROUP 1: CORE OPERATIONS */}
            <SidebarGroup label="Management">
              <NavItem to="/customers" end={true} icon={<MdPeople />} label="All Customers" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
              <NavItem to="/customers/add" icon={<MdPersonAddAlt />} label="New Registration" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
              <NavItem to="/agent" icon={<MdOutlineSupportAgent />} label="Agent Network" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
            </SidebarGroup>

            <div className="mx-6 my-2 border-t border-slate-200/50" />

            {/* GROUP 2: FINANCIAL SERVICES */}
            <SidebarGroup label="Service Desk">
              <NavItem to="/policy" icon={<MdOutlinePolicy />} label="Insurance Policy" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
              <NavItem to="/gst" icon={<MdOutlineReceiptLong />} label="GST Compliance" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
              <NavItem to="/itr" icon={<MdOutlineAnalytics />} label="ITR Filing" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
            </SidebarGroup>

            <div className="mx-6 my-2 border-t border-slate-200/50" />

            {/* GROUP 3: SYSTEM & SECURITY */}
            <SidebarGroup label="Settings & Security">
              <NavItem to="/change-password" icon={<MdLockOutline />} label="Update Password" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
              <NavItem to="/change-email" icon={<MdOutlineMail />} label="Email Update" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
              <NavItem to="/customers/trash" icon={<MdDeleteOutline />} label="Recycle Bin" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
            </SidebarGroup>

          </nav>

          {/* Footer Branding */}
          <div className="mt-auto p-4 mx-3 mb-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <p className="text-[10px] text-indigo-900 font-black tracking-widest uppercase">
                Adhya v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Helper Components for a "Senior" cleaner code structure
function SidebarGroup({ label, children }) {
  return (
    <div className="mt-4">
      <h2 className="px-7 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </h2>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function NavItem({ to, icon, label, onClick, styles, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `${styles.linkBase} ${styles.getLinkStyles(isActive)}`}
    >
      <span className="text-xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>
    </NavLink>
  );
}
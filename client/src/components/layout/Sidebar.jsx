import { NavLink } from "react-router-dom";
import { MdPeople, MdDelete, MdAdd, MdLock, MdEmail } from "react-icons/md";

export default function Sidebar({ isOpen, onClose }) {
  // 1. Structure: Use a light-gray bg to contrast against the white content/navbar
  const base =
    "fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-200 " +
    "transition-transform duration-300 ease-in-out md:static md:translate-x-0 pt-16 md:pt-6";

  // 2. Navigation Item Styling
  const linkBase =
    "group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium " +
    "transition-all duration-200 ease-in-out antialiased ";

  // 3. Active vs Inactive state logic
  const getLinkStyles = (isActive) =>
    isActive
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-1 ring-indigo-700/10"
      : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900";

  return (
    <>
      {/* Overlay - Smoother fade on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden z-30 transition-opacity"
        />
      )}

      <aside className={`${base} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">

          <nav className="flex flex-col gap-1.5 px-2">
            {/* Primary Management Group */}
            <div className="px-4 mt-2 mb-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Management
              </h2>
            </div>

            <NavItem to="/customers" end={true} icon={<MdPeople />} label="Customers" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
            <NavItem to="/customers/add" icon={<MdAdd />} label="Add Customer" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
            <NavItem to="/customers/trash" icon={<MdDelete />} label="Recycle Bin" onClick={onClose} styles={{ linkBase, getLinkStyles }} />

            {/* Divider */}
            <div className="my-4 mx-4 border-t border-slate-100" />

            {/* Security Group */}
            <div className="px-4 mb-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Security Sync
              </h2>
            </div>

            {/* 🔹 These match your root routes in App.jsx */}
            <NavItem to="/change-password" icon={<MdLock />} label="Update Password" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
            <NavItem to="/change-email" icon={<MdEmail />} label="Update Email" onClick={onClose} styles={{ linkBase, getLinkStyles }} />
          </nav>

          {/* Bottom Footer: Senior touch for versioning or support */}
          <div className="mt-auto p-6 border-t border-slate-200 bg-slate-100/50">
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase text-center">
              v1.0.0 • Adhya Computer
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

// Sub-component for cleaner mapping
function NavItem({ to, icon, label, onClick, styles, end }) {
  return (
    <NavLink
      to={to}
      end={end} // 👈 Add this line!
      onClick={onClick}
      className={({ isActive }) => `${styles.linkBase} ${styles.getLinkStyles(isActive)}`}
    >
      <span className="text-xl opacity-80 group-hover:scale-110 transition-transform">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
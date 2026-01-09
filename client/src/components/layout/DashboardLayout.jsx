import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  return (
    // 1. Fixed height prevents the whole body from scrolling
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onLogout={logout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* 2. Scrollbar-gutter: stable is the secret weapon here */}
        <main
          className="flex-1 bg-slate-50/50 p-6 overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          {/* 3. Max-width container prevents content from stretching too wide on huge monitors */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
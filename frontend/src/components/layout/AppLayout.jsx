import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import "../../styles/dashboard.css";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <div className={sidebarOpen ? "sidebar-wrapper open" : "sidebar-wrapper"}>
        <Sidebar onNavigate={closeSidebar} />
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <main className="main-content">
        <button
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {children}
      </main>
    </div>
  );
}

export default AppLayout;

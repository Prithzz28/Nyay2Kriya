import { FileText, LayoutDashboard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

const navItems = [
  { label: "Upload Judgment", path: "/upload", icon: FileText },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

export const AppLayout = ({ children }) => {
  const location = useLocation();
  const sidebarOpen = useAppStore((state) => state.ui.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const sectionTitle =
    navItems.find((item) => location.pathname.startsWith(item.path))?.label ||
    "Judgment Operations";

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
        role="presentation"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-head">
          <h1>CCMS</h1>
          <p>Judgment Intelligence System</p>
        </div>
        <div className="nav-group-title">Workspace</div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              title={item.label}
            >
              <item.icon size={16} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-footer-label">Mode</span>
          <strong>{sidebarOpen ? "Expanded" : "Compact"}</strong>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            type="button"
            className="menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <div className="topbar-title-block">
            <h2>Case Control and Monitoring Suite</h2>
            <p>Government-style judgment intake, review, and compliance workflow</p>
            <span className="topbar-kicker">{sectionTitle}</span>
          </div>
        </header>
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
};

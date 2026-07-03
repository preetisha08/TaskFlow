import {
  CheckSquare,
  LayoutDashboard,
  ListTodo,
  LogOut,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    onNavigate?.();
    logout();
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <CheckSquare size={21} />
          </div>
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" onClick={onNavigate}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/tasks" onClick={onNavigate}>
            <ListTodo size={20} />
            My Tasks
          </NavLink>

          <NavLink to="/team" onClick={onNavigate}>
            <UsersRound size={20} />
            Team
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">{initial}</div>

          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

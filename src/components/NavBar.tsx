import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, FlaskConical } from "lucide-react";

const NavBar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center h-12 gap-1">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-mono">AQ</span>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground hidden sm:block">AirScope</span>
        </div>
        <NavLink to="/" className={linkClass} end>
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;

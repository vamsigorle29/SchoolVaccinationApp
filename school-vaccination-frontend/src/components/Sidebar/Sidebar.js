import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Calendar, LogOut } from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      title: "Students",
      icon: Users,
      path: "/students",
    },
    {
      title: "Vaccination Drives",
      icon: Calendar,
      path: "/drives",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-card border-r h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          School Vaccination
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

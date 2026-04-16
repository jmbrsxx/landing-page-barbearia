import { Link, useLocation } from "react-router-dom";
import { Calendar, Scissors, User, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentsService } from "@/services/appointmentsService";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await appointmentsService.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    {
      label: "Meus Agendamentos",
      href: "/cliente/dashboard",
      icon: Calendar,
    },
    {
      label: "Serviços",
      href: "/cliente/dashboard?tab=services",
      icon: Scissors,
    },
    {
      label: "Minha Conta",
      href: "/cliente/dashboard?tab=profile",
      icon: User,
    },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border shadow-xl z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">BarberShop</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {user && (
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.displayName || user.email}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const currentPath = location.pathname + location.search;
              const itemPath = item.href;
              const isActive = currentPath === itemPath ||
                (location.pathname === "/cliente/dashboard" && !location.search && item.href === "/cliente/dashboard");

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
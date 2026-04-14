import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, Calendar, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentsService } from "@/services/appointmentsService";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthModal from "@/components/AuthModal";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await appointmentsService.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <a href="#inicio" className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="font-heading text-lg font-semibold text-foreground">
              Barber<span className="text-primary">Shop</span>
            </span>
          </a>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-muted-foreground hover:text-primary text-sm font-body uppercase tracking-widest transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/cliente/dashboard">
                  <Button variant="outline" size="sm">
                    Meu Painel
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Entrar
                </Button>
                <Link to="/cliente">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="container mx-auto px-6 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="block py-2 text-muted-foreground hover:text-primary text-sm font-body uppercase tracking-widest transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="border-t border-border pt-4 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/cliente/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Meu Painel
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Entrar
                    </Button>
                    <Link to="/cliente" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Agendar Horário
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;

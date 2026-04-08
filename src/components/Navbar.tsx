import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, Menu, X, Calendar, Settings, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted-foreground hover:text-primary text-sm font-body uppercase tracking-widest transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pl-6 border-l border-border">
            <Link to="/agendar">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendar
              </Button>
            </Link>
            <Link to="/admin/agendamentos">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
            {user ? (
              <Button variant="secondary" size="sm" className="flex items-center gap-2" onClick={handleSignOut}>
                <User className="w-4 h-4" />
                Sair
              </Button>
            ) : (
              <Button variant="secondary" size="sm" className="flex items-center gap-2" onClick={() => setShowAuthModal(true)}>
                <User className="w-4 h-4" />
                Entrar / Cadastrar
              </Button>
            )}
          </div>
        </div>
        {showAuthModal && <AuthModal onAuthSuccess={() => setShowAuthModal(false)} />}

        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-b border-border animate-fade-in">
          <div className="flex flex-col items-center py-6 gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-muted-foreground hover:text-primary text-sm font-body uppercase tracking-widest transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-border pt-6 w-full flex flex-col gap-3 px-6">
              <Link to="/agendar" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agendar Consulta
                </Button>
              </Link>
              <Link to="/admin/agendamentos" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Painel Admin
                </Button>
              </Link>
              {!user ? (
                <Button
                  variant="secondary"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowAuthModal(true);
                  }}
                >
                  <User className="w-4 h-4" />
                  Entrar / Cadastrar
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <User className="w-4 h-4" />
                  Sair
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

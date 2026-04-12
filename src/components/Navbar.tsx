import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <Link to="/cliente">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendar
              </Button>
            </Link>
          </div>
        </div>

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
              <Link to="/cliente" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agendar Consulta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { Scissors, Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-primary" />
          <span className="font-heading text-sm text-foreground">
            Barber<span className="text-primary">Shop</span> Canoas
          </span>
        </div>
        <p className="text-muted-foreground text-xs tracking-wider">
          © {new Date().getFullYear()} BarberShop Canoas. Todos os direitos reservados.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

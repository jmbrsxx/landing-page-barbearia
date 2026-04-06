import { useState, useEffect } from "react";
import { Scissors, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero-barbershop.jpg";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="inicio" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Interior da barbearia"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          className={`transition-all duration-1000 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary/50" />
            <Scissors className="w-5 h-5 text-primary" />
            <div className="h-px w-12 bg-primary/50" />
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
            <span className="gold-text">Barber</span>
            <span className="text-foreground">Shop</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-body font-light tracking-widest uppercase mb-8">
            Canoas · Rio Grande do Sul
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-foreground/70 text-base md:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Experiência premium em corte masculino. Tradição, estilo e precisão em cada detalhe.
          </p>
          <a
            href="https://wa.me/5551999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 gold-gradient text-primary-foreground px-8 py-4 rounded-sm font-body font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Agendar Horário
          </a>
        </div>
      </div>

      <a
        href="#servicos"
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
      </a>
    </section>
  );
};

export default HeroSection;

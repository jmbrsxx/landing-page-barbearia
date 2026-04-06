import { Scissors, Sparkles, Wind, Droplets } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  {
    icon: Scissors,
    title: "Corte Masculino",
    desc: "Corte personalizado com técnicas modernas e acabamento impecável.",
    price: "R$ 50",
  },
  {
    icon: Sparkles,
    title: "Barba Completa",
    desc: "Modelagem e aparagem com navalha, toalha quente e hidratação.",
    price: "R$ 35",
  },
  {
    icon: Wind,
    title: "Corte + Barba",
    desc: "O combo completo para o homem que valoriza cada detalhe.",
    price: "R$ 75",
  },
  {
    icon: Droplets,
    title: "Tratamento Capilar",
    desc: "Hidratação profunda e tratamentos para couro cabeludo saudável.",
    price: "R$ 60",
  },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="servicos" className="py-24 md:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary text-sm font-body uppercase tracking-[0.3em] mb-3">O que oferecemos</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <div className="divider-gold w-24 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group relative p-8 rounded-sm border border-border bg-card hover-gold cursor-default transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <s.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
              <p className="text-primary font-heading text-2xl font-bold">{s.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

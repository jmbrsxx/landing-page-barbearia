import { useScrollReveal } from "@/hooks/useScrollReveal";
import barberTradition from "@/assets/barber-tradition.jpg";

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="sobre" className="py-24 md:py-32 bg-secondary/30">
      <div ref={ref} className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative">
              <img
                src={barberTradition}
                alt="Barbeiro em ação"
                loading="lazy"
                width={800}
                height={1024}
                className="rounded-sm w-full max-h-[500px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-sm" />
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <p className="text-primary text-sm font-body uppercase tracking-[0.3em] mb-3">
              Desde 2018
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Tradição & Estilo
            </h2>
            <div className="divider-gold w-16 mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nascemos em Canoas com a missão de resgatar a arte da barbearia clássica, combinando técnicas 
              tradicionais com tendências contemporâneas. Cada corte é uma experiência única.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nossa equipe é formada por profissionais apaixonados, treinados para oferecer o melhor em 
              cuidado masculino. Aqui, você não é apenas um cliente — é parte da família.
            </p>
            <div className="flex gap-12">
              {[
                { num: "6+", label: "Anos" },
                { num: "5k+", label: "Clientes" },
                { num: "4", label: "Barbeiros" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-3xl font-bold text-primary">{stat.num}</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

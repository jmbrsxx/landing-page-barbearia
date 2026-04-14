import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ContactSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contato" className="py-24 md:py-32 bg-secondary/30">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary text-sm font-body uppercase tracking-[0.3em] mb-3">Visite-nos</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contato & Localização
          </h2>
          <div className="divider-gold w-24 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: MapPin,
              title: "Endereço",
              lines: ["Rua Ipiranga, 123", "Centro, Canoas - RS", "CEP 92010-000"],
            },
            {
              icon: Clock,
              title: "Horário",
              lines: ["Seg a Sex: 9h às 20h", "Sábado: 9h às 18h", "Domingo: Fechado"],
            },
            {
              icon: Phone,
              title: "Contato",
              lines: ["(51) 99999-9999", "@barbershopcanoas", "Agende pelo WhatsApp"],
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`text-center p-8 rounded-sm border border-border bg-card hover-gold transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="text-muted-foreground text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link to="/cliente">
            <button className="inline-flex items-center gap-2 gold-gradient text-primary-foreground px-8 py-4 rounded-sm font-body font-semibold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
              <Phone className="w-4 h-4" />
              Agendar Horário
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

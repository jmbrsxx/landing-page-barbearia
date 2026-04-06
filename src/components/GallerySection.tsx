import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroImg from "@/assets/hero-barbershop.jpg";
import barberAction from "@/assets/barber-action.jpg";
import galleryBarberCut from "@/assets/gallery-barber-cut.jpg";

const images = [
  { src: heroImg, alt: "Interior da barbearia", className: "col-span-2 row-span-2" },
  { src: barberAction, alt: "Barbeiro trabalhando", className: "col-span-1 row-span-1" },
  { src: galleryBarberCut, alt: "Corte de cabelo profissional", className: "col-span-1 row-span-1" },
];

const GallerySection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="galeria" className="py-24 md:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-primary text-sm font-body uppercase tracking-[0.3em] mb-3">Ambiente</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossa Galeria
          </h2>
          <div className="divider-gold w-24 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`${img.className} overflow-hidden rounded-sm group transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

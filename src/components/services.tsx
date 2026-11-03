import Image from "next/image";
import { services } from "@/data/content";

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">Serviços</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
          O evento inteiro, de um ponto que o chão não alcança.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Cada cobertura tem começo, meio e entrega combinados. O tipo de evento muda o roteiro, não o cuidado.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service, index) => (
            <li
              key={service.title}
              className={`surface overflow-hidden ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{service.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Image from "next/image";
import { folders, services } from "@/data/content";

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">Folders</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
          Eventos, esportes, obras e divulgação.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          O material oficial da MKDrones61. O orçamento sai pelo WhatsApp que está nos folders.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.title} className="surface overflow-hidden">
              <div className="relative aspect-square bg-black">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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
        <ul className="mt-4 grid gap-4 lg:grid-cols-3">
          {folders.map((folder) => (
            <li key={folder.src} className={`surface overflow-hidden ${folder.wide ? "lg:col-span-3" : ""}`}>
              <Image
                src={folder.src}
                alt={folder.alt}
                width={folder.width}
                height={folder.height}
                sizes={folder.wide ? "100vw" : "(min-width: 1024px) 33vw, 100vw"}
                className="h-auto w-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

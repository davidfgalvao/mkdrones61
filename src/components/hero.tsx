import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { site, whatsappHref } from "@/config/site";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <p className="eyebrow">Brasília, DF e entorno</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {site.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{site.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn btn-primary" href={whatsappHref()}>
              Chamar no WhatsApp
            </a>
            <Link className="btn btn-secondary" href="/#trabalhos">
              Ver trabalhos realizados
            </Link>
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              WhatsApp{" "}
              <a className="text-foreground underline-offset-4 hover:underline" href={whatsappHref()}>
                {site.phoneDisplay}
              </a>
              . O voo é combinado com o local e segue as regras da ANAC.
            </span>
          </p>
        </div>
        <div className="relative pb-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4]">
            <Image
              src="/images/evento.jpg"
              alt="Público em um evento noturno, com confete e luzes de palco."
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-2 right-3 left-3 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-[var(--shadow)] backdrop-blur sm:left-auto sm:w-80">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/images/drone.jpg"
                alt="Drone branco em voo, com a câmera voltada para baixo."
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <p className="text-sm leading-snug">
              Filmagem estabilizada, com roteiro escrito antes do evento.
            </p>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-xs tracking-wide text-muted uppercase">
        Imagens ilustrativas do tipo de cobertura
      </p>
    </section>
  );
}

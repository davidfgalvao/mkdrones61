import { MessageCircle } from "lucide-react";
import { site, whatsappHref } from "@/config/site";

export function Contact() {
  return (
    <section id="contato" className="scroll-mt-24 border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow">Contato</p>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          Conte a data e o lugar pelo WhatsApp.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          O orçamento é pelo WhatsApp {site.phoneDisplay}. Mande a data, o local e o que precisa
          ser filmado: evento, esporte, obra ou divulgação.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a className="btn btn-primary" href={whatsappHref()}>
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
            Chamar no WhatsApp
          </a>
          <a className="btn btn-secondary" href={site.instagramHref}>
            Instagram {site.instagram}
          </a>
        </div>
      </div>
    </section>
  );
}

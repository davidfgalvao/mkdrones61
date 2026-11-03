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
          O atendimento é direto no WhatsApp {site.phoneDisplay}. Mande a data, o local e o tipo de
          evento para combinar a cobertura.
        </p>
        <a className="btn btn-primary mt-8" href={whatsappHref()}>
          <MessageCircle aria-hidden="true" className="h-5 w-5" />
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}

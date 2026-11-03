import { MessageCircle } from "lucide-react";
import { site, whatsappHref } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl">{site.name}</p>
            <p className="mt-2 max-w-md text-muted">
              Cobertura de eventos com drone em {site.location}.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <a className="underline-offset-4 hover:underline" href={whatsappHref()}>
              WhatsApp {site.phoneDisplay}
            </a>
            <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className="underline-offset-4 hover:underline" href="/admin">
              Área administrativa
            </a>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-5 py-4 text-sm text-muted">
            © {year} {site.name}. Imagens ilustrativas.
          </p>
        </div>
      </footer>
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <a
          className="btn btn-primary w-full"
          href={whatsappHref()}
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <MessageCircle aria-hidden="true" className="h-5 w-5" />
          WhatsApp {site.phoneDisplay}
        </a>
      </div>
    </>
  );
}

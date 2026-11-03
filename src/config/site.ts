export const site = {
  name: "MKDrones61",
  legalName: "MKDrones61",
  headline: "Cobertura aérea para o dia que não se repete.",
  subtitle:
    "Imagens e vídeos aéreos para eventos, esportes, obras e divulgação. Atendimento em Brasília, no Distrito Federal e no entorno.",
  description:
    "MKDrones61 faz imagens aéreas no Distrito Federal e no entorno. Eventos, esportes, acompanhamento de obras e divulgação, com voo dentro das regras do local.",
  phoneDisplay: "(61) 99877-2993",
  phoneE164: "5561998772993",
  instagram: "@mkdrones61",
  instagramHref: "https://instagram.com/mkdrones61",
  whatsappMessage:
    "Olá! Vi o site da MKDrones61 e quero um orçamento de imagens aéreas.",
  location: "Distrito Federal e entorno",
  yearStart: 2026,
};

export const nav = [
  { href: "/#trabalhos", label: "Trabalhos" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#atendimento", label: "Atendimento" },
  { href: "/#contato", label: "Contato" },
  { href: "/admin", label: "Admin" },
] as const;

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim().replace(/\/$/, "");
  if (production) return `https://${production}`;
  return "http://localhost:3000";
}

export function whatsappHref(message = site.whatsappMessage) {
  return `https://wa.me/${site.phoneE164}?text=${encodeURIComponent(message)}`;
}

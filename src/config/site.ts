export const site = {
  name: "Galvão Aerial",
  legalName: "Galvão Aerial",
  headline: "Cobertura aérea para o dia que não se repete.",
  subtitle:
    "Filmagem e fotografia com drone para casamentos, festas, corporativos e shows. Atendimento em Brasília, no Distrito Federal e no entorno.",
  description:
    "Galvão Aerial faz cobertura de eventos com drone no Distrito Federal e no entorno. Casamentos, festas, eventos corporativos, shows, formaturas e esportes, com roteiro combinado e voo dentro das regras do local.",
  email: "bruno-dab-10@hotmail.com",
  phoneDisplay: "(61) 99822-7987",
  phoneE164: "5561998227987",
  whatsappMessage:
    "Olá! Vi o site da Galvão Aerial e quero cobertura com drone para um evento.",
  location: "Distrito Federal e entorno",
  yearStart: 2026,
};

export const nav = [
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

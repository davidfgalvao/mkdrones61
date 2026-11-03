import { getSiteUrl, site } from "@/config/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: getSiteUrl(),
    telephone: `+${site.phoneE164}`,
    email: site.email,
    image: `${getSiteUrl()}/images/evento.jpg`,
    areaServed: ["Distrito Federal", "Entorno do Distrito Federal"],
    address: {
      "@type": "PostalAddress",
      addressRegion: "DF",
      addressCountry: "BR",
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

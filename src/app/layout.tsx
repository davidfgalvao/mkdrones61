import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { getSiteUrl, site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Cobertura de eventos com drone no DF`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "drone para eventos",
    "filmagem com drone",
    "cobertura de casamento com drone",
    "drone Brasília",
    "drone Distrito Federal",
    "filmagem aérea entorno",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: `${site.name} — Cobertura de eventos com drone no DF`,
    description: site.subtitle,
    images: [
      {
        url: "/trabalhos/catedral.jpg",
        width: 1024,
        height: 576,
        alt: "Catedral de Brasília iluminada, em tomada aérea noturna.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Cobertura de eventos com drone no DF`,
    description: site.subtitle,
    images: ["/trabalhos/catedral.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-background text-foreground">
        <a href="#conteudo" className="skip-link no-print">
          Ir para o conteúdo
        </a>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}

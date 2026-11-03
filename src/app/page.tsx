import { Contact } from "@/components/contact";
import { Coverage } from "@/components/coverage";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Process } from "@/components/process";
import { Services } from "@/components/services";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" className="pb-24 md:pb-0">
        <Hero />
        <Services />
        <Process />
        <Coverage />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

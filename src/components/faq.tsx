import { questions } from "@/data/content";
import { ChevronDown } from "lucide-react";

export function Faq() {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <p className="eyebrow">Perguntas</p>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          Antes de reservar a data.
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {questions.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-base font-semibold">
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="pb-4 leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

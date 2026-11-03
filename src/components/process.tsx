import { points, steps } from "@/data/content";

export function Process() {
  return (
    <section id="como-funciona" className="scroll-mt-24 border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">Como funciona</p>
        <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          Três passos, do primeiro contato à entrega.
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="surface p-6">
              <p className="font-display text-3xl text-accent">{step.number}</p>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {points.map((point) => (
            <li key={point.title} className="surface p-6">
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

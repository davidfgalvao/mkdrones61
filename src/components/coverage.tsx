import { federalDistrict, surroundings } from "@/data/content";

export function Coverage() {
  return (
    <section id="atendimento" className="scroll-mt-24 border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">Atendimento</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
          Brasília, o Distrito Federal e o entorno.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          O deslocamento entra no orçamento. Se a cidade não estiver na lista, chame mesmo assim: a resposta diz se a data fecha.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <CityGroup title="Distrito Federal" cities={federalDistrict} />
          <CityGroup title="Entorno" cities={surroundings} />
        </div>
      </div>
    </section>
  );
}

function CityGroup({ title, cities }: { title: string; cities: readonly string[] }) {
  return (
    <div className="surface p-6">
      <h3 className="font-display text-2xl">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {cities.map((city) => (
          <li
            key={city}
            className="rounded-full border border-border px-3 py-2 text-sm leading-none"
          >
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
}

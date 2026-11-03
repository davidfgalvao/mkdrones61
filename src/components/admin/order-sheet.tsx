import { site } from "@/config/site";
import { formatDateBr, formatDateTimeBr, formatMoney } from "@/lib/money";
import { blank, orderCode, statusLabels, type ServiceOrder } from "@/lib/orders-shared";

export function OrderSheet({ order }: { order: ServiceOrder }) {
  const balance = Math.max(order.amountCents - order.depositCents, 0);
  const hours = [order.startTime, order.endTime].filter(Boolean).join(" às ");

  return (
    <article className="documento" aria-label={`Ordem de serviço ${orderCode(order)}`}>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7e5e4] pb-5">
        <div>
          <p className="font-display text-3xl text-[#1c1917]">{site.name}</p>
          <p className="mt-1 text-sm text-[#44403c]">Cobertura aérea de eventos</p>
          <p className="mt-2 text-sm text-[#44403c]">
            {site.location}
            <br />
            {site.phoneDisplay} · {site.email}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs tracking-[0.14em] text-[#57534e] uppercase">Ordem de serviço</p>
          <p className="mt-1 font-display text-2xl">{orderCode(order)}</p>
          <p className="mt-2 text-sm text-[#44403c]">Emitida em {formatDateTimeBr(order.createdAt)}</p>
          <p className="text-sm text-[#44403c]">Status: {statusLabels[order.status]}</p>
        </div>
      </header>

      <Section title="Contratante">
        <Field label="Nome" value={order.clientName} />
        <Field label="Documento" value={blank(order.clientDocument)} />
        <Field label="E-mail" value={blank(order.clientEmail)} />
        <Field label="Telefone" value={blank(order.clientPhone)} />
      </Section>

      <Section title="Evento">
        <Field label="Nome" value={order.eventName} />
        <Field label="Tipo" value={order.eventType} />
        <Field label="Data" value={formatDateBr(order.eventDate)} />
        <Field label="Horário" value={blank(hours)} />
        <Field label="Local" value={blank(order.address)} />
        <Field label="Cidade" value={blank(order.city)} />
      </Section>

      <Section title="Serviço">
        <Field label="Descrição" value={order.description} />
        <Field label="Entregas" value={blank(order.deliverables)} />
        <Field label="Equipamento" value={blank(order.equipment)} />
        <Field label="Equipe" value={blank(order.team)} />
      </Section>

      <Section title="Valores">
        <Field label="Valor total" value={formatMoney(order.amountCents)} />
        <Field label="Sinal" value={formatMoney(order.depositCents)} />
        <Field label="Saldo" value={formatMoney(balance)} />
        <Field label="Forma de pagamento" value={blank(order.paymentTerms)} />
      </Section>

      <Section title="Observações">
        <p className="whitespace-pre-wrap leading-relaxed">{blank(order.notes)}</p>
      </Section>

      <p className="mt-8 text-sm leading-relaxed text-[#44403c]">
        O voo depende das condições do tempo, da autorização do local e das regras da ANAC.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <Signature label="Contratante" />
        <Signature label={site.name} />
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="bg-[#f5f0e8] px-3 py-2 text-sm font-semibold tracking-wide text-[#44403c] uppercase">
        {title}
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="block text-xs tracking-wide text-[#57534e] uppercase">{label}</span>
      <span className="mt-1 block whitespace-pre-wrap leading-relaxed">{value}</span>
    </p>
  );
}

function Signature({ label }: { label: string }) {
  return (
    <div>
      <div className="border-t border-[#1c1917] pt-2 text-sm">{label}</div>
    </div>
  );
}

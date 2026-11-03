import type { Metadata } from "next";
import Link from "next/link";
import { deleteOrder } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { formatDateBr, formatMoney } from "@/lib/money";
import { listOrders } from "@/lib/orders";
import { orderCode, statusLabels } from "@/lib/orders-shared";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ordens de serviço",
  robots: { index: false, follow: false },
};

export default async function AdminHome() {
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let dbError = "";
  try {
    orders = await listOrders();
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Não foi possível ler as ordens.";
  }

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Ordens de serviço</h1>
          <p className="mt-2 text-muted">
            {orders.length === 0
              ? "Nenhuma ordem gravada ainda."
              : `${orders.length} ${orders.length === 1 ? "ordem gravada" : "ordens gravadas"}.`}
          </p>
        </div>
        <Link className="btn btn-primary" href="/admin/os/nova">
          Emitir ordem
        </Link>
      </div>

      {dbError ? (
        <p role="alert" className="surface field-error mt-6 p-4">
          {dbError}
        </p>
      ) : null}

      {orders.length === 0 && !dbError ? (
        <div className="surface mt-8 p-6">
          <p>Quando você emitir a primeira ordem, ela aparece aqui para imprimir ou baixar em PDF.</p>
        </div>
      ) : null}

      <ul className="mt-6 grid gap-3">
        {orders.map((order) => (
          <li key={order.id} className="surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-accent">{orderCode(order)}</p>
                <h2 className="mt-1 text-xl font-semibold">{order.clientName}</h2>
                <p className="mt-1 text-muted">
                  {order.eventName} · {formatDateBr(order.eventDate)} · {formatMoney(order.amountCents)}
                </p>
                <p className="mt-2 text-sm">{statusLabels[order.status]}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="btn btn-secondary" href={`/admin/os/${order.id}`}>
                  Abrir
                </Link>
                <Link className="btn btn-secondary" href={`/admin/os/${order.id}/imprimir`}>
                  Imprimir
                </Link>
                <form action={deleteOrder}>
                  <input type="hidden" name="id" value={order.id} />
                  <ConfirmSubmit className="btn btn-danger" message={`Excluir ${orderCode(order)}?`}>
                    Excluir
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

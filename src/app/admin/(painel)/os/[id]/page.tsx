import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderSheet } from "@/components/admin/order-sheet";
import { getOrder } from "@/lib/orders";
import { orderCode } from "@/lib/orders-shared";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ordem de serviço",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salva?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl">
      {query.salva === "1" ? (
        <p role="status" className="surface mb-4 p-4 text-sm">
          Ordem {orderCode(order)} salva. Você já pode imprimir ou baixar o PDF.
        </p>
      ) : null}
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <Link className="btn btn-primary" href={`/admin/os/${order.id}/imprimir`}>
          Imprimir ou salvar PDF
        </Link>
        <a className="btn btn-secondary" href={`/api/admin/os/${order.id}/pdf`}>
          Baixar PDF
        </a>
        <Link className="btn btn-secondary" href={`/admin/os/${order.id}/editar`}>
          Editar
        </Link>
      </div>
      <OrderSheet order={order} />
    </main>
  );
}

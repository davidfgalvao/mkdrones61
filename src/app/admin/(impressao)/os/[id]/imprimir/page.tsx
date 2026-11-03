import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintActions } from "@/components/admin/print-actions";
import { OrderSheet } from "@/components/admin/order-sheet";
import { getOrder } from "@/lib/orders";
import { orderCode } from "@/lib/orders-shared";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Imprimir ordem de serviço",
  robots: { index: false, follow: false },
};

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <main>
      <PrintActions
        pdfHref={`/api/admin/os/${order.id}/pdf`}
        backHref={`/admin/os/${order.id}`}
        code={orderCode(order)}
      />
      <OrderSheet order={order} />
    </main>
  );
}

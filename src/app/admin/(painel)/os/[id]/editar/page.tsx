import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderForm } from "@/components/admin/order-form";
import { getOrder } from "@/lib/orders";
import { orderCode } from "@/lib/orders-shared";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editar ordem de serviço",
  robots: { index: false, follow: false },
};

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl">Editar {orderCode(order)}</h1>
      <p className="mt-2 mb-8 text-muted">{order.clientName}</p>
      <OrderForm order={order} />
    </main>
  );
}

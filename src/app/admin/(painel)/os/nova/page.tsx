import type { Metadata } from "next";
import { OrderForm } from "@/components/admin/order-form";

export const metadata: Metadata = {
  title: "Nova ordem de serviço",
  robots: { index: false, follow: false },
};

export default function NewOrderPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl">Nova ordem de serviço</h1>
      <p className="mt-2 mb-8 text-muted">
        Depois de salvar, a ordem pode ser impressa ou baixada em PDF.
      </p>
      <OrderForm />
    </main>
  );
}

import { getSession } from "@/lib/auth";
import { buildOrderPdf } from "@/lib/pdf";
import { getOrder } from "@/lib/orders";
import { orderCode } from "@/lib/orders-shared";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const order = await getOrder(id);
  if (!order) {
    return Response.json({ error: "Ordem não encontrada." }, { status: 404 });
  }

  const pdf = await buildOrderPdf(order);
  const filename = `${orderCode(order)}.pdf`;
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

import { requireAdmin } from "@/lib/auth";

export default async function PrintLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="mx-auto max-w-3xl px-5 py-8">{children}</div>;
}

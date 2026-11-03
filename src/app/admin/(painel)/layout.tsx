import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { site } from "@/config/site";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-dvh">
      <header className="no-print border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm text-muted">Área administrativa</p>
            <p className="font-display text-2xl">{site.name}</p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Administração">
            <Link className="btn btn-secondary" href="/admin">
              Ordens
            </Link>
            <Link className="btn btn-primary" href="/admin/os/nova">
              Nova ordem
            </Link>
            <Link className="btn btn-secondary" href="/">
              Ver site
            </Link>
            <form action={logout}>
              <button className="btn btn-secondary" type="submit">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}

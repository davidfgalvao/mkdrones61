import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/config/site";
import { getSession } from "@/lib/auth";
import { safeAdminPath } from "@/lib/session-token";

export const metadata: Metadata = {
  title: "Acesso administrativo",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getSession()) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="eyebrow">Área interna</p>
      <h1 className="mt-3 font-display text-4xl">{site.name}</h1>
      <p className="mt-3 leading-relaxed text-muted">
        Acesso do administrador para emitir e imprimir ordens de serviço.
      </p>
      <LoginForm next={safeAdminPath(params.next)} />
      <Link href="/" className="mt-6 text-sm text-muted underline-offset-4 hover:underline">
        Voltar ao site
      </Link>
    </main>
  );
}

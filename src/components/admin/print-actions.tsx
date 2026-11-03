"use client";

import Link from "next/link";

export function PrintActions({
  pdfHref,
  backHref,
  code,
}: {
  pdfHref: string;
  backHref: string;
  code: string;
}) {
  return (
    <div className="no-print mb-6">
      <p className="mb-3 text-sm text-muted">
        {code}. No diálogo de impressão, escolha Salvar como PDF se quiser o arquivo pelo navegador.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          Imprimir ou salvar PDF
        </button>
        <a className="btn btn-secondary" href={pdfHref}>
          Baixar PDF
        </a>
        <Link className="btn btn-secondary" href={backHref}>
          Voltar
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site, whatsappHref } from "@/config/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 border-b border-border bg-[var(--header)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Mark />
          <span className="font-display text-xl leading-none">{site.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Seções">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-sm font-medium hover:text-accent">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a className="btn btn-primary hidden md:inline-flex" href={whatsappHref()}>
            WhatsApp
          </a>
          <button
            type="button"
            className="btn btn-secondary px-3 md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="menu-mobile" className="border-t border-border px-5 py-4 md:hidden" aria-label="Seções">
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="btn btn-secondary w-full"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a className="btn btn-primary w-full" href={whatsappHref()}>
              WhatsApp {site.phoneDisplay}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function Mark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-9 w-9 text-accent">
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 21.5 16 8.5l8 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="18.5" r="1.7" fill="currentColor" />
    </svg>
  );
}

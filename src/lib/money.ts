export function parseMoney(value: string): number | null {
  const raw = value.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (!raw) return null;

  let normalized = raw;
  if (raw.includes(",")) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(raw)) {
    normalized = raw.replace(/\./g, "");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount > 10_000_000) return null;
  return Math.round(amount * 100);
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export function centsToInput(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDateBr(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate || "Não informado";
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function formatDateTimeBr(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

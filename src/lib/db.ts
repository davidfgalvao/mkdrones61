import { createClient, type Client, type Row } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";

const globalForDb = globalThis as unknown as { mkdronesDb?: Client };
let schema: Promise<void> | null = null;

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS service_orders (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_document TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  client_phone TEXT NOT NULL DEFAULT '',
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  start_time TEXT NOT NULL DEFAULT '',
  end_time TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  deliverables TEXT NOT NULL DEFAULT '',
  equipment TEXT NOT NULL DEFAULT '',
  team TEXT NOT NULL DEFAULT '',
  amount_cents INTEGER NOT NULL DEFAULT 0,
  deposit_cents INTEGER NOT NULL DEFAULT 0,
  payment_terms TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT ''
)`;

function remoteAuthToken() {
  return process.env.DATABASE_AUTH_TOKEN?.trim() || process.env.TURSO_AUTH_TOKEN?.trim() || "";
}

export function databaseUrl() {
  const configured = process.env.DATABASE_URL?.trim() || process.env.TURSO_DATABASE_URL?.trim();
  if (configured) return configured;
  return `file:${path.join(process.cwd(), "data", "mkdrones61.db")}`;
}

function assertConfigured(url: string) {
  if (process.env.VERCEL && url.startsWith("file:")) {
    throw new Error("O banco remoto ainda não está ligado a este projeto.");
  }
  if (!url.startsWith("file:") && !remoteAuthToken()) {
    throw new Error("Falta o token do banco remoto.");
  }
}

function client() {
  if (globalForDb.mkdronesDb) return globalForDb.mkdronesDb;
  const url = databaseUrl();
  assertConfigured(url);
  if (url.startsWith("file:")) {
    mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
  }
  const authToken = remoteAuthToken();
  globalForDb.mkdronesDb = createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
  return globalForDb.mkdronesDb;
}

async function ready() {
  if (!schema) {
    schema = client()
      .execute(CREATE_TABLE)
      .then(() => undefined)
      .catch((error: unknown) => {
        schema = null;
        const detail = error instanceof Error ? error.message : "erro desconhecido";
        if (process.env.NODE_ENV === "development") {
          throw new Error(`Não foi possível preparar o banco. ${detail}`);
        }
        throw new Error("Não foi possível preparar o banco de ordens de serviço.");
      });
  }
  return schema;
}

export async function query(sql: string, args: Array<string | number | null> = []) {
  await ready();
  return client().execute({ sql, args });
}

export function cell(row: Row, key: string) {
  const value = row[key];
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (value == null) return "";
  return String(value);
}

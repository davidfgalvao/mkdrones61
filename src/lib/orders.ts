import { cell, query } from "@/lib/db";
import {
  orderStatuses,
  type OrderData,
  type OrderStatus,
  type ServiceOrder,
} from "@/lib/orders-shared";

function text(row: Parameters<typeof cell>[0], key: string) {
  const value = cell(row, key);
  return typeof value === "number" ? String(value) : value;
}

function integer(row: Parameters<typeof cell>[0], key: string) {
  const value = cell(row, key);
  return typeof value === "number" ? value : Number(value || 0);
}

function mapOrder(row: Parameters<typeof cell>[0]): ServiceOrder {
  const status = text(row, "status");
  return {
    id: text(row, "id"),
    number: integer(row, "number"),
    createdAt: text(row, "created_at"),
    updatedAt: text(row, "updated_at"),
    status: orderStatuses.includes(status as OrderStatus) ? (status as OrderStatus) : "emitida",
    clientName: text(row, "client_name"),
    clientDocument: text(row, "client_document"),
    clientEmail: text(row, "client_email"),
    clientPhone: text(row, "client_phone"),
    eventName: text(row, "event_name"),
    eventType: text(row, "event_type"),
    eventDate: text(row, "event_date"),
    startTime: text(row, "start_time"),
    endTime: text(row, "end_time"),
    address: text(row, "address"),
    city: text(row, "city"),
    description: text(row, "description"),
    deliverables: text(row, "deliverables"),
    equipment: text(row, "equipment"),
    team: text(row, "team"),
    amountCents: integer(row, "amount_cents"),
    depositCents: integer(row, "deposit_cents"),
    paymentTerms: text(row, "payment_terms"),
    notes: text(row, "notes"),
  };
}

export async function listOrders() {
  const result = await query(
    "SELECT * FROM service_orders ORDER BY number DESC",
  );
  return result.rows.map((row) => mapOrder(row));
}

export async function getOrder(id: string) {
  const result = await query("SELECT * FROM service_orders WHERE id = ?", [id]);
  const row = result.rows[0];
  if (!row) return null;
  return mapOrder(row);
}

export async function saveOrderRecord(input: OrderData) {
  const now = new Date().toISOString();
  if (input.id) {
    const current = await getOrder(input.id);
    if (!current) throw new Error("Ordem de serviço não encontrada.");
    await query(
      `UPDATE service_orders SET
        updated_at = ?, status = ?, client_name = ?, client_document = ?, client_email = ?,
        client_phone = ?, event_name = ?, event_type = ?, event_date = ?, start_time = ?,
        end_time = ?, address = ?, city = ?, description = ?, deliverables = ?, equipment = ?,
        team = ?, amount_cents = ?, deposit_cents = ?, payment_terms = ?, notes = ?
      WHERE id = ?`,
      [
        now,
        input.status,
        input.clientName,
        input.clientDocument,
        input.clientEmail,
        input.clientPhone,
        input.eventName,
        input.eventType,
        input.eventDate,
        input.startTime,
        input.endTime,
        input.address,
        input.city,
        input.description,
        input.deliverables,
        input.equipment,
        input.team,
        input.amount,
        input.deposit,
        input.paymentTerms,
        input.notes,
        input.id,
      ],
    );
    return input.id;
  }

  const max = await query("SELECT COALESCE(MAX(number), 0) AS max_number FROM service_orders");
  const nextNumber = (max.rows[0] ? integer(max.rows[0], "max_number") : 0) + 1;
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO service_orders (
      id, number, created_at, updated_at, status, client_name, client_document, client_email,
      client_phone, event_name, event_type, event_date, start_time, end_time, address, city,
      description, deliverables, equipment, team, amount_cents, deposit_cents, payment_terms, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      nextNumber,
      now,
      now,
      input.status,
      input.clientName,
      input.clientDocument,
      input.clientEmail,
      input.clientPhone,
      input.eventName,
      input.eventType,
      input.eventDate,
      input.startTime,
      input.endTime,
      input.address,
      input.city,
      input.description,
      input.deliverables,
      input.equipment,
      input.team,
      input.amount,
      input.deposit,
      input.paymentTerms,
      input.notes,
    ],
  );
  return id;
}

export async function removeOrder(id: string) {
  await query("DELETE FROM service_orders WHERE id = ?", [id]);
}

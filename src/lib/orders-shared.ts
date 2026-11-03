import { z } from "zod";
import { fieldErrors } from "@/lib/contact";
import { parseMoney } from "@/lib/money";

export const orderStatuses = ["rascunho", "emitida", "concluida", "cancelada"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const statusLabels: Record<OrderStatus, string> = {
  rascunho: "Rascunho",
  emitida: "Emitida",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export const serviceEventTypes = [
  "Casamento",
  "Festa ou aniversário",
  "Evento corporativo",
  "Show ou festival",
  "Formatura",
  "Esporte",
  "Outro",
] as const;

const optionalText = (max: number, message: string) => z.string().trim().max(max, message);

function moneyField(required: boolean, label: string) {
  return z
    .string()
    .trim()
    .superRefine((value, context) => {
      if (!value) {
        if (required) {
          context.addIssue({ code: "custom", message: `Informe ${label}.` });
        }
        return;
      }
      if (parseMoney(value) === null) {
        context.addIssue({
          code: "custom",
          message: `${label} deve ser um valor como 1.500,00.`,
        });
      }
    })
    .transform((value) => (value ? (parseMoney(value) ?? 0) : 0));
}

export const orderSchema = z
  .object({
    id: z.string().trim().max(80).default(""),
    status: z.enum(orderStatuses, "Selecione o status."),
    clientName: z
      .string()
      .trim()
      .min(2, "Informe o nome do contratante.")
      .max(160, "O nome está longo demais."),
    clientDocument: optionalText(24, "O documento está longo demais."),
    clientEmail: z
      .string()
      .trim()
      .max(160, "O e-mail está longo demais.")
      .refine(
        (value) => value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Informe um e-mail válido.",
      ),
    clientPhone: z
      .string()
      .trim()
      .max(20, "O telefone está longo demais.")
      .refine(
        (value) => value.length === 0 || value.replace(/\D/g, "").length >= 10,
        "Informe o telefone com DDD.",
      ),
    eventName: z
      .string()
      .trim()
      .min(2, "Informe o nome do evento.")
      .max(160, "O nome do evento está longo demais."),
    eventType: z.enum(serviceEventTypes, "Selecione o tipo de evento."),
    eventDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data do evento."),
    startTime: z
      .string()
      .trim()
      .refine((value) => value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), "Horário inválido."),
    endTime: z
      .string()
      .trim()
      .refine((value) => value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), "Horário inválido."),
    address: optionalText(240, "O endereço está longo demais."),
    city: optionalText(80, "A cidade está longa demais."),
    description: z
      .string()
      .trim()
      .min(10, "Descreva o serviço em pelo menos 10 caracteres.")
      .max(4000, "A descrição passou de 4.000 caracteres."),
    deliverables: optionalText(1000, "As entregas passaram do limite."),
    equipment: optionalText(400, "O equipamento passou do limite."),
    team: optionalText(240, "A equipe passou do limite."),
    amount: moneyField(true, "o valor total"),
    deposit: moneyField(false, "o sinal"),
    paymentTerms: optionalText(400, "A forma de pagamento passou do limite."),
    notes: optionalText(2000, "As observações passaram do limite."),
  })
  .superRefine((data, context) => {
    if (data.deposit > data.amount) {
      context.addIssue({
        code: "custom",
        path: ["deposit"],
        message: "O sinal não pode ser maior que o valor total.",
      });
    }
  });

export type OrderData = z.infer<typeof orderSchema>;

export type ServiceOrder = {
  id: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  clientName: string;
  clientDocument: string;
  clientEmail: string;
  clientPhone: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  address: string;
  city: string;
  description: string;
  deliverables: string;
  equipment: string;
  team: string;
  amountCents: number;
  depositCents: number;
  paymentTerms: string;
  notes: string;
};

export function orderCode(order: Pick<ServiceOrder, "number" | "createdAt">) {
  const year = Number.isNaN(new Date(order.createdAt).getFullYear())
    ? new Date().getFullYear()
    : new Date(order.createdAt).getFullYear();
  return `OS-${year}-${String(order.number).padStart(4, "0")}`;
}

export function orderFieldErrors(error: z.ZodError) {
  return fieldErrors(error);
}

export function blank(value: string) {
  const text = value.trim();
  return text.length > 0 ? text : "Não informado";
}

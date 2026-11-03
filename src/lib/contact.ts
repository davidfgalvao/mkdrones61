import { z } from "zod";

export const eventTypes = [
  "Casamento",
  "Festa ou aniversário",
  "Evento corporativo",
  "Show ou festival",
  "Formatura",
  "Esporte",
  "Outro",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "O nome está longo demais."),
  email: z
    .string()
    .trim()
    .max(160, "O e-mail está longo demais.")
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Informe um e-mail válido."),
  phone: z
    .string()
    .trim()
    .max(20, "O telefone está longo demais.")
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Informe o telefone com DDD.")
    .refine((value) => /^[\d\s()+-]+$/.test(value), "Use apenas números e símbolos de telefone."),
  eventType: z.enum(eventTypes, "Selecione o tipo de evento."),
  eventDate: z
    .string()
    .trim()
    .max(20, "A data está longa demais.")
    .refine((value) => value.length === 0 || /^\d{4}-\d{2}-\d{2}$/.test(value), "Informe uma data válida."),
  message: z
    .string()
    .trim()
    .min(20, "Descreva o evento em pelo menos 20 caracteres.")
    .max(4000, "A mensagem passou do limite de 4.000 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !map[key]) map[key] = issue.message;
  }
  return map;
}

export function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

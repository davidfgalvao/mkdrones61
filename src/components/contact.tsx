"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site, whatsappHref } from "@/config/site";
import { contactSchema, eventTypes, fieldErrors, oneLine, type ContactInput } from "@/lib/contact";

const initialValues: ContactInput = {
  name: "",
  email: "",
  phone: "",
  eventType: "Casamento",
  eventDate: "",
  message: "",
};

const fieldOrder = ["name", "email", "phone", "eventType", "eventDate", "message"] as const;

export function Contact() {
  const [values, setValues] = useState<ContactInput>(initialValues);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update<K extends keyof ContactInput>(key: K, value: ContactInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate(next: ContactInput) {
    const parsed = contactSchema.safeParse(next);
    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }
    const nextErrors = fieldErrors(parsed.error);
    setErrors(nextErrors);
    const first = fieldOrder.find((key) => nextErrors[key]);
    if (first) document.getElementById(first)?.focus();
    return null;
  }

  function onBlur(key: (typeof fieldOrder)[number]) {
    const parsed = contactSchema.safeParse(values);
    if (parsed.success) return;
    const nextErrors = fieldErrors(parsed.error);
    setErrors((current) => ({ ...current, [key]: nextErrors[key] ?? "" }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    const data = validate(values);
    if (!data) {
      setStatus("error");
      setFeedback("Revise os campos destacados.");
      return;
    }

    if (website.trim()) {
      setStatus("success");
      setFeedback("Mensagem enviada. O retorno chega pelo e-mail ou pelo WhatsApp informados.");
      setValues(initialValues);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Nome: data.name,
          "E-mail": data.email,
          Telefone: data.phone,
          "Tipo de evento": data.eventType,
          Data: data.eventDate || "Não informada",
          Mensagem: data.message,
          _replyto: data.email,
          _subject: `Cobertura de drone: ${oneLine(data.eventType)} — ${oneLine(data.name)}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        success?: string;
        message?: string;
      } | null;

      if (/activat/i.test(payload?.message ?? "")) {
        setStatus("error");
        setFeedback(
          "O formulário precisa de uma confirmação. Abra o Hotmail e clique no link de ativação do FormSubmit.",
        );
        return;
      }

      if (!response.ok || payload?.success !== "true") {
        setStatus("error");
        setFeedback("Não foi possível enviar agora. Tente de novo ou use o WhatsApp.");
        return;
      }

      setStatus("success");
      setFeedback("Mensagem enviada. O retorno chega pelo e-mail ou pelo WhatsApp informados.");
      setValues(initialValues);
    } catch {
      setStatus("error");
      setFeedback("Não foi possível enviar agora. Tente de novo ou use o WhatsApp.");
    }
  }

  return (
    <section id="contato" className="scroll-mt-24 border-t border-border py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <p className="eyebrow">Contato</p>
          <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Conte a data e o lugar.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            O caminho mais rápido é o WhatsApp. Se preferir, o formulário chega no e-mail.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a className="btn btn-primary w-full sm:w-auto" href={whatsappHref()}>
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              WhatsApp {site.phoneDisplay}
            </a>
            <a className="btn btn-secondary w-full sm:w-auto" href={`mailto:${site.email}`}>
              <Mail aria-hidden="true" className="h-5 w-5" />
              {site.email}
            </a>
          </div>
        </div>
        <form className="surface p-5 sm:p-7" onSubmit={onSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="name"
              label="Nome"
              value={values.name}
              error={errors.name}
              autoComplete="name"
              onChange={(value) => update("name", value)}
              onBlur={() => onBlur("name")}
            />
            <Field
              id="email"
              label="E-mail"
              type="email"
              value={values.email}
              error={errors.email}
              autoComplete="email"
              onChange={(value) => update("email", value)}
              onBlur={() => onBlur("email")}
            />
            <Field
              id="phone"
              label="Telefone"
              type="tel"
              value={values.phone}
              error={errors.phone}
              autoComplete="tel"
              onChange={(value) => update("phone", value)}
              onBlur={() => onBlur("phone")}
            />
            <div>
              <label htmlFor="eventType" className="mb-2 block font-medium">
                Tipo de evento
              </label>
              <select
                id="eventType"
                className="field"
                value={values.eventType}
                aria-invalid={Boolean(errors.eventType)}
                aria-describedby={errors.eventType ? "eventType-error" : undefined}
                onBlur={() => onBlur("eventType")}
                onChange={(event) => update("eventType", event.target.value as ContactInput["eventType"])}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.eventType ? (
                <p id="eventType-error" className="field-error mt-2">
                  {errors.eventType}
                </p>
              ) : null}
            </div>
            <Field
              id="eventDate"
              label="Data do evento"
              type="date"
              value={values.eventDate}
              error={errors.eventDate}
              onChange={(value) => update("eventDate", value)}
              onBlur={() => onBlur("eventDate")}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="message" className="mb-2 block font-medium">
              O que você precisa
            </label>
            <textarea
              id="message"
              className="field"
              value={values.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : "message-help"}
              onBlur={() => onBlur("message")}
              onChange={(event) => update("message", event.target.value)}
            />
            <p id="message-help" className="mt-2 text-sm text-muted">
              Local, horário e se a entrega é filme, fotos ou os dois.
            </p>
            {errors.message ? (
              <p id="message-error" className="field-error mt-2">
                {errors.message}
              </p>
            ) : null}
          </div>
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Site
              <input
                value={website}
                tabIndex={-1}
                autoComplete="off"
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Enviando..." : "Enviar por e-mail"}
            </button>
            <p role="status" aria-live="polite" className="text-sm text-muted">
              {feedback}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className={id === "eventDate" ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-2 block font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="field"
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="field-error mt-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}

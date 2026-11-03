"use client";

import { useActionState, useState } from "react";
import { saveOrder } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/action-state";
import { centsToInput } from "@/lib/money";
import {
  orderFieldErrors,
  orderSchema,
  orderStatuses,
  serviceEventTypes,
  statusLabels,
  type ServiceOrder,
} from "@/lib/orders-shared";

type FormValues = {
  id: string;
  status: string;
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
  amount: string;
  deposit: string;
  paymentTerms: string;
  notes: string;
};

const emptyValues: FormValues = {
  id: "",
  status: "emitida",
  clientName: "",
  clientDocument: "",
  clientEmail: "",
  clientPhone: "",
  eventName: "",
  eventType: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  address: "",
  city: "",
  description: "",
  deliverables: "",
  equipment: "",
  team: "",
  amount: "",
  deposit: "",
  paymentTerms: "",
  notes: "",
};

function fromOrder(order?: ServiceOrder): FormValues {
  if (!order) return emptyValues;
  return {
    id: order.id,
    status: order.status,
    clientName: order.clientName,
    clientDocument: order.clientDocument,
    clientEmail: order.clientEmail,
    clientPhone: order.clientPhone,
    eventName: order.eventName,
    eventType: order.eventType,
    eventDate: order.eventDate,
    startTime: order.startTime,
    endTime: order.endTime,
    address: order.address,
    city: order.city,
    description: order.description,
    deliverables: order.deliverables,
    equipment: order.equipment,
    team: order.team,
    amount: centsToInput(order.amountCents),
    deposit: order.depositCents ? centsToInput(order.depositCents) : "",
    paymentTerms: order.paymentTerms,
    notes: order.notes,
  };
}

export function OrderForm({ order }: { order?: ServiceOrder }) {
  const [values, setValues] = useState<FormValues>(() => fromOrder(order));
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [state, action, pending] = useActionState(saveOrder, emptyActionState);
  const errors = { ...state.errors, ...clientErrors };

  function update(key: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setClientErrors((current) => ({ ...current, [key]: "" }));
  }

  return (
    <form
      action={action}
      className="grid gap-8"
      noValidate
      onSubmit={(event) => {
        const parsed = orderSchema.safeParse(values);
        if (parsed.success) {
          setClientErrors({});
          return;
        }
        event.preventDefault();
        const nextErrors = orderFieldErrors(parsed.error);
        setClientErrors(nextErrors);
        const first = Object.keys(nextErrors)[0];
        if (first) document.getElementById(first)?.focus();
      }}
    >
      <input type="hidden" name="id" value={values.id} />
      <p className="text-sm text-muted">Campos com asterisco são obrigatórios.</p>
      {state.message ? (
        <p role="alert" className="field-error">
          {state.message}
        </p>
      ) : null}

      <fieldset className="grid gap-4">
        <legend className="font-display text-2xl">Contratante</legend>
        <TextField
          id="clientName"
          name="clientName"
          label="Nome"
          required
          value={values.clientName}
          error={errors.clientName}
          autoComplete="name"
          onChange={(value) => update("clientName", value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="clientDocument"
            name="clientDocument"
            label="CPF ou CNPJ"
            value={values.clientDocument}
            error={errors.clientDocument}
            onChange={(value) => update("clientDocument", value)}
          />
          <TextField
            id="clientPhone"
            name="clientPhone"
            label="Telefone"
            type="tel"
            value={values.clientPhone}
            error={errors.clientPhone}
            autoComplete="tel"
            onChange={(value) => update("clientPhone", value)}
          />
        </div>
        <TextField
          id="clientEmail"
          name="clientEmail"
          label="E-mail"
          type="email"
          value={values.clientEmail}
          error={errors.clientEmail}
          autoComplete="email"
          onChange={(value) => update("clientEmail", value)}
        />
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="font-display text-2xl">Evento</legend>
        <TextField
          id="eventName"
          name="eventName"
          label="Nome do evento"
          required
          value={values.eventName}
          error={errors.eventName}
          onChange={(value) => update("eventName", value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="eventType"
            name="eventType"
            label="Tipo"
            required
            value={values.eventType}
            error={errors.eventType}
            onChange={(value) => update("eventType", value)}
            options={serviceEventTypes.map((type) => ({ value: type, label: type }))}
            placeholder="Selecione"
          />
          <TextField
            id="eventDate"
            name="eventDate"
            label="Data"
            type="date"
            required
            value={values.eventDate}
            error={errors.eventDate}
            onChange={(value) => update("eventDate", value)}
          />
          <TextField
            id="startTime"
            name="startTime"
            label="Início"
            type="time"
            value={values.startTime}
            error={errors.startTime}
            onChange={(value) => update("startTime", value)}
          />
          <TextField
            id="endTime"
            name="endTime"
            label="Término"
            type="time"
            value={values.endTime}
            error={errors.endTime}
            onChange={(value) => update("endTime", value)}
          />
        </div>
        <TextField
          id="address"
          name="address"
          label="Endereço"
          value={values.address}
          error={errors.address}
          onChange={(value) => update("address", value)}
        />
        <TextField
          id="city"
          name="city"
          label="Cidade"
          value={values.city}
          error={errors.city}
          onChange={(value) => update("city", value)}
        />
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="font-display text-2xl">Serviço</legend>
        <AreaField
          id="description"
          name="description"
          label="Descrição"
          required
          value={values.description}
          error={errors.description}
          help="O que será filmado e quais horários não podem faltar."
          onChange={(value) => update("description", value)}
        />
        <AreaField
          id="deliverables"
          name="deliverables"
          label="Entregas"
          value={values.deliverables}
          error={errors.deliverables}
          help="Fotos, filme, cortes curtos e prazo."
          onChange={(value) => update("deliverables", value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="equipment"
            name="equipment"
            label="Equipamento"
            value={values.equipment}
            error={errors.equipment}
            onChange={(value) => update("equipment", value)}
          />
          <TextField
            id="team"
            name="team"
            label="Equipe"
            value={values.team}
            error={errors.team}
            onChange={(value) => update("team", value)}
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="font-display text-2xl">Valores</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="amount"
            name="amount"
            label="Valor total (R$)"
            required
            inputMode="decimal"
            value={values.amount}
            error={errors.amount}
            onChange={(value) => update("amount", value)}
          />
          <TextField
            id="deposit"
            name="deposit"
            label="Sinal (R$)"
            inputMode="decimal"
            value={values.deposit}
            error={errors.deposit}
            onChange={(value) => update("deposit", value)}
          />
        </div>
        <TextField
          id="paymentTerms"
          name="paymentTerms"
          label="Forma de pagamento"
          value={values.paymentTerms}
          error={errors.paymentTerms}
          onChange={(value) => update("paymentTerms", value)}
        />
        <SelectField
          id="status"
          name="status"
          label="Status"
          required
          value={values.status}
          error={errors.status}
          onChange={(value) => update("status", value)}
          options={orderStatuses.map((status) => ({ value: status, label: statusLabels[status] }))}
        />
        <AreaField
          id="notes"
          name="notes"
          label="Observações"
          value={values.notes}
          error={errors.notes}
          onChange={(value) => update("notes", value)}
        />
      </fieldset>

      <button className="btn btn-primary w-full sm:w-auto" type="submit" disabled={pending}>
        {pending ? "Salvando..." : order ? "Salvar alterações" : "Emitir ordem"}
      </button>
    </form>
  );
}

function TextField({
  id,
  name,
  label,
  value,
  error,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "decimal";
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
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

function AreaField({
  id,
  name,
  label,
  value,
  error,
  help,
  onChange,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  help?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const describedBy = [help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className="field"
        onChange={(event) => onChange(event.target.value)}
      />
      {help ? (
        <p id={`${id}-help`} className="mt-2 text-sm text-muted">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error mt-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  value,
  error,
  onChange,
  options,
  placeholder,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field"
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} className="field-error mt-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { endSession, requireAdmin, startSession } from "@/lib/auth";
import { removeOrder, saveOrderRecord } from "@/lib/orders";
import { orderFieldErrors, orderSchema } from "@/lib/orders-shared";
import { adminConfigured, safeAdminPath, safeEqual } from "@/lib/session-token";

export async function login(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeAdminPath(String(formData.get("next") ?? ""));

  if (!adminConfigured()) {
    return {
      message: "O acesso administrativo ainda não foi configurado no servidor.",
      errors: {},
    };
  }

  if (!email || !password) {
    return { message: "Informe e-mail e senha.", errors: {} };
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";
  const emailOk = await safeEqual(email, configuredEmail);
  const passwordOk = await safeEqual(password, configuredPassword);

  if (!emailOk || !passwordOk) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { message: "E-mail ou senha incorretos.", errors: {} };
  }

  const started = await startSession();
  if (!started) {
    return {
      message: "O acesso administrativo ainda não foi configurado no servidor.",
      errors: {},
    };
  }

  redirect(next);
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function saveOrder(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      message: "Revise os campos destacados.",
      errors: orderFieldErrors(parsed.error),
    };
  }

  let id = "";
  try {
    id = await saveOrderRecord(parsed.data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível gravar a ordem de serviço.";
    return { message, errors: {} };
  }

  redirect(`/admin/os/${id}?salva=1`);
}

export async function deleteOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (id) await removeOrder(id);
  redirect("/admin");
}

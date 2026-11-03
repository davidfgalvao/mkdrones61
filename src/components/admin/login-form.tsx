"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/admin/actions";
import { emptyActionState } from "@/lib/action-state";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, emptyActionState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <form action={action} className="surface mt-8 p-6" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="username" className="mb-2 block font-medium">
          Usuário
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="field"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="password" className="mb-2 block font-medium">
          Senha
        </label>
        <div className="flex gap-2">
          <input
            id="password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            className="field min-w-0 flex-1"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary shrink-0"
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>
      {state.message ? (
        <p role="alert" className="field-error mt-4">
          {state.message}
        </p>
      ) : null}
      <button className="btn btn-primary mt-5 w-full" type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

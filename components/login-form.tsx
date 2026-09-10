"use client";

import { useActionState } from "react";

import { signInWithPassword, type AuthState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy, type Locale } from "@/lib/i18n";

const initialState: AuthState = {
  status: "idle",
  message: "",
};

export function LoginForm({ locale }: { locale: Locale }) {
  const t = copy[locale].auth;
  const [state, action, pending] = useActionState(signInWithPassword, initialState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <Input name="email" type="email" placeholder={t.email} autoComplete="email" required />
      <Input name="password" type="password" placeholder={t.password} autoComplete="current-password" required />
      <Button type="submit" disabled={pending}>
        {pending ? t.loginPending : t.loginSubmit}
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

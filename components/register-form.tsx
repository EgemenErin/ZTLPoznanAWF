"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerWithPassword, type AuthState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy, type Locale } from "@/lib/i18n";

const initialState: AuthState = {
  status: "idle",
  message: "",
};

export function RegisterForm({ locale }: { locale: Locale }) {
  const t = copy[locale].auth;
  const [state, action, pending] = useActionState(registerWithPassword, initialState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <Input
        name="displayName"
        placeholder={t.displayName}
        autoComplete="name"
        required
      />
      <Input name="email" type="email" placeholder={t.email} autoComplete="email" required />
      <Input
        name="password"
        type="password"
        placeholder={t.password}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder={t.confirmPassword}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <select
        name="interest"
        className="h-12 rounded-full border border-ink/15 bg-white/70 px-5 text-sm text-ink shadow-sm outline-none focus:ring-2 focus:ring-brass"
        defaultValue=""
      >
        <option value="">{t.interestPlaceholder}</option>
        <option value="dancer">{t.interests.dancer}</option>
        <option value="musician">{t.interests.musician}</option>
        <option value="alumni">{t.interests.alumni}</option>
        <option value="parent">{t.interests.parent}</option>
        <option value="event_guest">{t.interests.eventGuest}</option>
        <option value="folklore_fan">{t.interests.folkloreFan}</option>
      </select>
      <label className="flex gap-3 text-sm leading-6 text-ink/65">
        <input name="newsletterConsent" type="checkbox" className="mt-1 h-4 w-4 rounded border-ink/20" />
        {t.newsletterConsent}
      </label>
      <Button type="submit" disabled={pending} variant="brass">
        {pending ? t.registerPending : t.registerSubmit}
      </Button>
      <p className="text-sm text-ink/60">
        {t.hasAccount}{" "}
        <Link href="/auth/login" className="font-semibold text-wine">
          {t.loginSubmit}
        </Link>
      </p>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

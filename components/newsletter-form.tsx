"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";

import { subscribeToNewsletter, type NewsletterState } from "@/app/newsletter/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy, type Locale } from "@/lib/i18n";

const initialState: NewsletterState = {
  status: "idle",
  message: "",
};

export function NewsletterForm({ locale }: { locale: Locale }) {
  const t = copy[locale].newsletter;
  const [state, action, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
        <Input name="firstName" placeholder={t.firstName} autoComplete="given-name" />
        <Input name="email" type="email" placeholder={t.email} autoComplete="email" required />
      </div>
      <label className="flex gap-3 text-sm leading-6 text-ink/65">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-ink/20" required />
        {t.consent}
      </label>
      <Button type="submit" size="lg" variant="brass" disabled={pending}>
        {pending ? t.pending : t.submit} <ArrowRight className="h-4 w-4" />
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

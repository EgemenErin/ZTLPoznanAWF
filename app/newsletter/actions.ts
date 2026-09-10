"use server";

import { Resend } from "resend";

import { createSupabaseAdminClient, hasSupabaseServiceEnv } from "@/lib/supabase/admin";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Podaj poprawny adres e-mail." };
  }

  if (!consent) {
    return { status: "error", message: "Zgoda marketingowa jest wymagana." };
  }

  if (!hasSupabaseServiceEnv()) {
    return {
      status: "success",
      message: "Dziękujemy. Formularz jest gotowy, podłącz dane Supabase w .env, aby zapisywać subskrypcje.",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subs")
    .upsert(
      {
        email,
        first_name: firstName || null,
        locale: "pl",
        status: "subscribed",
        source: "newsletter-page",
        consent_marketing: true,
        consented_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (error) {
    return { status: "error", message: "Nie udało się zapisać subskrypcji. Spróbuj ponownie." };
  }

  if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const contact = await resend.contacts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
    });

    if (contact.data?.id && data?.id) {
      await supabase
        .from("newsletter_subs")
        .update({ resend_contact_id: contact.data.id })
        .eq("id", data.id);
    }
  }

  return { status: "success", message: "Jesteś na liście. Do zobaczenia przy najbliższej okazji." };
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Locale } from "@/lib/i18n";

export async function setLocale(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "pl";
  const returnTo = String(formData.get("returnTo") ?? "/");
  const cookieStore = await cookies();

  cookieStore.set("locale", locale satisfies Locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  redirect(returnTo.startsWith("/") ? returnTo : "/");
}

"use server";

import { redirect } from "next/navigation";

import { createSupabaseAdminClient, hasSupabaseServiceEnv } from "@/lib/supabase/admin";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type AuthState = {
  status: "idle" | "success" | "error";
  message: string;
};

function isEnglish(formData: FormData) {
  return formData.get("locale") === "en";
}

function usernameFromEmail(email: string, userId: string) {
  const prefix = email.split("@")[0] ?? "member";
  const safePrefix = prefix.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
  return `${safePrefix}_${userId.slice(0, 6)}`;
}

export async function signInWithPassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const en = isEnglish(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) {
    return { status: "error", message: en ? "Enter a valid email address." : "Podaj poprawny adres e-mail." };
  }

  if (password.length < 6) {
    return { status: "error", message: en ? "Password must be at least 6 characters." : "Hasło musi mieć co najmniej 6 znaków." };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: en ? "Connect Supabase in .env.local to log in." : "Podłącz Supabase w .env.local, aby się logować.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase password login error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    return {
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `${en ? "Could not log in" : "Nie udało się zalogować"}: ${error.message}`
          : en ? "Could not log in." : "Nie udało się zalogować.",
    };
  }

  const userId = data.user?.id;
  if (!userId) {
    await supabase.auth.signOut();
    return { status: "error", message: en ? "Could not log in." : "Nie udało się zalogować." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: en ? "Admin access only." : "Dostęp tylko dla administratorów.",
    };
  }

  redirect("/admin");
}

export async function registerWithPassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const en = isEnglish(formData);
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const interest = String(formData.get("interest") ?? "").trim();
  const newsletterConsent = formData.get("newsletterConsent") === "on";

  if (!displayName) {
    return { status: "error", message: en ? "Enter your name or username." : "Podaj imię lub nazwę użytkownika." };
  }

  if (!email.includes("@")) {
    return { status: "error", message: en ? "Enter a valid email address." : "Podaj poprawny adres e-mail." };
  }

  if (password.length < 6) {
    return { status: "error", message: en ? "Password must be at least 6 characters." : "Hasło musi mieć co najmniej 6 znaków." };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: en ? "Passwords do not match." : "Hasła nie są takie same." };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message: en ? "Connect Supabase in .env.local to register accounts." : "Podłącz Supabase w .env.local, aby rejestrować konta.",
    };
  }

  if (hasSupabaseServiceEnv()) {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: displayName,
        interest,
        newsletter_consent: newsletterConsent,
      },
    });

    if (error || !data.user) {
      return {
        status: "error",
        message:
          process.env.NODE_ENV === "development"
            ? `${en ? "Could not create account" : "Nie udało się utworzyć konta"}: ${error?.message ?? (en ? "missing user" : "brak użytkownika")}`
            : en ? "Could not create account." : "Nie udało się utworzyć konta.",
      };
    }

    const { error: profileError } = await admin.from("profiles").upsert({
      id: data.user.id,
      display_name: displayName,
      username: usernameFromEmail(email, data.user.id),
      bio: interest ? `Interest: ${interest}` : null,
      role: "member",
    });

    if (profileError) {
      console.error("Profile upsert after registration failed:", profileError);
    }

    const { error: profileDetailsError } = await admin
      .from("profiles")
      .update({
        interests: interest ? [interest] : [],
        marketing_consent: newsletterConsent,
      })
      .eq("id", data.user.id);

    if (profileDetailsError) {
      console.error("Profile details update after registration failed:", profileDetailsError);
    }

    if (newsletterConsent) {
      const { error: newsletterError } = await admin.from("newsletter_subs").upsert(
        {
          email,
          first_name: displayName,
          locale: "pl",
          status: "subscribed",
          source: "registration",
          consent_marketing: true,
          consented_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );

      if (newsletterError) {
        console.error("Newsletter upsert after registration failed:", newsletterError);
      }
    }

    const supabase = await createSupabaseServerClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return {
        status: "success",
        message: en ? "Account was created. You can now log in with your password." : "Konto zostało utworzone. Możesz teraz zalogować się hasłem.",
      };
    }

    redirect("/forum");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
      data: {
        full_name: displayName,
        interest,
        newsletter_consent: newsletterConsent,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message:
        process.env.NODE_ENV === "development"
          ? `${en ? "Could not create account" : "Nie udało się utworzyć konta"}: ${error.message}`
          : en ? "Could not create account." : "Nie udało się utworzyć konta.",
    };
  }

  return {
    status: "success",
    message: en
      ? "Account was created. If Supabase requires email confirmation, check your inbox."
      : "Konto zostało utworzone. Jeśli Supabase wymaga potwierdzenia e-mail, sprawdź skrzynkę.",
  };
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}

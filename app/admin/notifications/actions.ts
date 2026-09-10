"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ADMIN_NOTIFS_SEEN_COOKIE } from "@/lib/admin-notifications";

export async function markAdminNotificationsSeen() {
  const jar = await cookies();
  jar.set(ADMIN_NOTIFS_SEEN_COOKIE, new Date().toISOString(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
}

import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejestracja | ZTL Poznań AWF",
};

export default function RegisterPage() {
  redirect("/");
}

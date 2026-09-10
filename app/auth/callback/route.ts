import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code && hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/forum", requestUrl.origin));
}

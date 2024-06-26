import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (res.error) {
      return NextResponse.redirect(`${requestUrl.origin}?error=true`, {
        status: 301,
      });
    }
    return NextResponse.redirect(`${requestUrl.origin}/projekty`, {
      status: 301,
    });
  } catch {
    return NextResponse.redirect(`${requestUrl.origin}?error=true`, {
      status: 301,
    });
  }
}

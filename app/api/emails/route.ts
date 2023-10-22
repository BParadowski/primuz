import { Database } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { cookies } from "next/headers";
import InfoEmail from "@/components/emails/infoEmail";

export async function POST(request: Request) {
  // remember to add authentication here
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const resend = new Resend(process.env.RESEND_API_KEY!);

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: "bartoszparadowski01@gmail.com",
    subject: "Hello World",
    react: InfoEmail({}),
  });

  return NextResponse.json({ status: "OK" });
}

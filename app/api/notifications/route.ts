import { Database } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const user = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, status: 401 });
  }

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      app_id: process.env.ONE_SIGNAL_APP_ID,
      include_aliases: {
        external_id: ["2abe583a-055a-4c07-af34-9fe2be479900"],
      },
      target_channel: "push",
      contents: {
        en: "English or Any Language Message",
      },
      name: "INTERNAL_CAMPAIGN_NAME",
      url: "https://primuz.vercel.app/admin/projekty",
    }),
  };

  fetch("https://onesignal.com/api/v1/notifications", options)
    .then((response) => response.json())
    .then((response) => console.dir(response, null))
    .catch((err) => console.error(err));

  return NextResponse.json({ success: true });
}

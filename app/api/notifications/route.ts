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

  const {
    targets,
    message,
    internalName,
    projectId,
  }: {
    targets: "everyone" | string[];
    message: string;
    internalName: string;
    projectId: string;
  } = await request.json();

  const allUserIds = (await supabase.from("users").select("user_id")).data?.map(
    (userIdObject) => userIdObject.user_id,
  );

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      app_id: process.env.ONE_SIGNAL_APP_ID,
      include_external_user_ids: targets === "everyone" ? allUserIds : targets,
      target_channel: "push",
      contents: {
        en: message,
      },
      name: internalName,
      url: `https://primuz.vercel.app/projekty/${projectId}`,
    }),
  };

  fetch("https://onesignal.com/api/v1/notifications", options)
    .then((response) => response.json())
    .then((response) => console.dir(response, null))
    .catch((err) => console.error(err));

  return NextResponse.json({ success: true });
}

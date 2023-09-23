import { Database } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { status, message, userId, projectId } = await request.json();

  try {
    const insertion = await supabase
      .from("availability")
      .update({ message, status })
      .eq("project_id", projectId)
      .eq("user_id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false });
  }
}

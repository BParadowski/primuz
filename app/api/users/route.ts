import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  const formData = request.formData();
  const userId = String((await formData).get("userId"));
  const firstName = String((await formData).get("firstName"));
  const lastName = String((await formData).get("lastName"));
  const instrument = String((await formData).get("instrument"));

  const { error } = await supabase
    .from("users")
    .update({
      first_name: firstName,
      last_name: lastName,
      instrument: instrument,
    })
    .eq("user_id", userId);

  console.log(error);

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  });
}

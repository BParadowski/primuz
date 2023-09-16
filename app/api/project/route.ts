import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
// npm i encoding

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();

  let event = {
    summary: String(formData.get("name")),
    description: String(formData.get("calendarDescription")),
    location: String(formData.get("location")),
    start: {
      date: String(formData.get("start")),
    },
    end: {
      date: String(formData.get("start")),
    },
  };

  try {
    const calendarResponse = await fetch(
      new URL("/api/calendar", request.url),
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(event),
      },
    ).then((res) => res.json());

    if (calendarResponse.success === true) {
      //   await supabase.from("projects").insert();
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: false });
}

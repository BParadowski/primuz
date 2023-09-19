import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { format } from "date-fns";
// npm i encoding

import { NewProjectFormData } from "@/app/(logged-in)/admin/nowy-projekt/page";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData: NewProjectFormData = await request.json();

  // formData.date is not of type Date but string since JSON does not have a date type

  const calendarEvent = {
    summary: formData.name,
    description: formData.calendarDescription,
    location: formData.location,
    start: {
      date: format(new Date(formData.date), "yyyy-MM-dd"),
    },
    end: {
      date: format(new Date(formData.date), "yyyy-MM-dd"),
    },
    colorId: "9",
  };

  console.log(formData);

  const dbInsertion = supabase.from("projects").insert({
    id: formData.id,
    name: formData.name,
    location: formData.location,
    pay: formData.pay,
    date: new Date(formData.date).toISOString(),
    description: formData.description,
    google_calendar_description: formData.calendarDescription,
    google_calendar_id: formData.calendarId,
  });

  const calendarInsertion = fetch(new URL("/api/calendar", request.url), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    // mode: "cors",
    body: JSON.stringify(calendarEvent),
  }).then((res) => res.json());

  const rehearsalCalendarInsertions = formData.rehearsals.map((rehearsal) => {
    return fetch(new URL("/api/calendar", request.url), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "cors",
      body: JSON.stringify({
        summary: `Próba do: "${formData.name}"`,
        description: rehearsal.description,
        location: rehearsal.location,
        start: {
          dateTime: rehearsal.start,
        },
        end: {
          dateTime: rehearsal.end,
        },
        colorId: "1",
      }),
    }).then((res) => res.json());
  });

  try {
    const result = await Promise.allSettled([
      dbInsertion,
      calendarInsertion,
      ...rehearsalCalendarInsertions,
    ]);
    console.table(result);

    NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: false });
}

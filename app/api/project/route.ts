import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { newCalendarEvent } from "./clendar";
import { Database } from "@/lib/supabase";
// npm i encoding

import { NewProjectFormData } from "@/app/(logged-in)/admin/nowy-projekt/page";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const formData: NewProjectFormData = await request.json();

  // formData.date is not of type Date but string since JSON does not have a date type
  formData.date = new Date(formData.date);

  // google for some reason does not accept '-' characters in ids so they are removed

  const calendarEvent = {
    id: formData.calendarId.replaceAll("-", ""),
    summary: formData.name,
    description: formData.calendarDescription,
    location: formData.location,
    start: {
      date: format(formData.date, "yyyy-MM-dd"),
    },
    end: {
      date: format(formData.date, "yyyy-MM-dd"),
    },
    colorId: "9",
  };

  // First await project insertion so that db doesn't throw foreign key error on rehearsal insertions.
  const dbInsertion = await supabase.from("projects").insert({
    id: formData.id,
    name: formData.name,
    location: formData.location,
    pay: formData.pay,
    date: formData.date.toISOString(),
    description: formData.description,
    google_calendar_description: formData.calendarDescription,
    google_calendar_id: formData.calendarId.replaceAll("-", ""),
  });

  const calendarInsertion = newCalendarEvent(calendarEvent);

  const dbRehearsalInsertions = formData.rehearsals.map((rehearsal) =>
    supabase.from("rehearsals").insert({
      id: rehearsal.id,
      project_id: formData.id,
      google_calendar_id: rehearsal.calendarId.replaceAll("-", ""),
      description: rehearsal.description,
      end_datetime: rehearsal.end,
      start_datetime: rehearsal.start,
      location: rehearsal.location,
    }),
  );

  const rehearsalCalendarInsertions = formData.rehearsals.map((rehearsal) =>
    newCalendarEvent({
      id: rehearsal.calendarId.replaceAll("-", ""),
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
  );

  try {
    const result = await Promise.allSettled([
      calendarInsertion,
      ...dbRehearsalInsertions,
      ...rehearsalCalendarInsertions,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

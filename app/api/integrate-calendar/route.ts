import { Database } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { formSchema } from "@/components/admin/google-calendar-page/integrationFormSchema";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { calendar_v3 } from "googleapis";
import { newCalendarEvent } from "@/lib/calendar";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const user = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, status: 401 });
  }

  const requestData = await request.json();

  try {
    var newCalendarId = formSchema.parse(requestData).calendarId;
  } catch (err) {
    return NextResponse.json({ success: false, message: JSON.stringify(err) });
  }

  try {
    await supabase
      .from("config")
      .update({ value: newCalendarId })
      .eq("id", "calendar_id")
      .select()
      .single();
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: err });
  }

  /* Add all non-archived projects to calendar */

  const yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1),
  ).toISOString();

  const { data: projectsData } = await supabase
    .from("projects")
    .select(
      "google_calendar_id, name, google_calendar_description, date, location",
    )
    .gte("date", yesterday);

  if (!projectsData) {
    return NextResponse.json({ success: true });
  }

  const calendarProjectsInsertion = projectsData.map((projectData) => {
    const {
      name,
      date,
      location,
      google_calendar_description,
      google_calendar_id,
    } = projectData;

    const calendarEvent = {
      id: google_calendar_id,
      summary: name,
      description: google_calendar_description,
      location: location,
      start: {
        date: formatInTimeZone(new Date(date), "Europe/Warsaw", "yyyy-MM-dd"),
        timeZone: "Europe/Warsaw",
      },
      end: {
        date: formatInTimeZone(new Date(date), "Europe/Warsaw", "yyyy-MM-dd"),
        timeZone: "Europe/Warsaw",
      },
      colorId: "9",
    } satisfies calendar_v3.Schema$Event;

    return newCalendarEvent(calendarEvent, newCalendarId);
  });

  /* Add all non-archived rehearsals to calendar */

  const { data: rehearsalsData } = await supabase
    .from("rehearsals")
    .select(
      "start_datetime, end_datetime, google_calendar_id, project:projects!inner(name), location, description",
    )
    .gte("start_datetime", yesterday);

  if (!rehearsalsData) {
    return NextResponse.json({ success: true });
  }

  const calendarRehearsalsInsertion = rehearsalsData.map((rehearsalData) => {
    const {
      project: { name },
      start_datetime,
      end_datetime,
      location,
      description,
      google_calendar_id,
    } = rehearsalData;

    const calendarEvent = {
      id: google_calendar_id,
      summary: `Próba do: "${name}"`,
      description: description,
      location: location,
      start: {
        dateTime: start_datetime,
      },
      end: {
        dateTime: end_datetime,
      },
      colorId: "1",
    } satisfies calendar_v3.Schema$Event;

    return newCalendarEvent(calendarEvent, newCalendarId);
  });

  try {
    await Promise.all([calendarProjectsInsertion, calendarRehearsalsInsertion]);
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: `Error integrating the calendar: ${err}`,
    });
  }

  return NextResponse.json({ success: true });
}

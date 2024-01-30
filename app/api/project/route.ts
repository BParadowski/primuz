import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { newCalendarEvent, updateCalendarEvent } from "@/lib/calendar";
import { Database } from "@/lib/supabase";
// npm i encoding

import { NewProjectFormData } from "@/app/(logged-in)/admin/nowy-projekt/page";

// create new project

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const isAdmin = (await supabase.rpc("is_admin")).data;
  if (!isAdmin) return NextResponse.json({ success: false, status: 401 });

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
      date: formatInTimeZone(formData.date, "Europe/Warsaw", "yyyy-MM-dd"),
    },
    end: {
      date: formatInTimeZone(formData.date, "Europe/Warsaw", "yyyy-MM-dd"),
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

  const repertoireInsertion = formData.pieces.map((pieceId) =>
    supabase
      .from("projects_pieces")
      .insert({ project_id: formData.id, piece_id: pieceId }),
  );

  try {
    const result = await Promise.allSettled([
      calendarInsertion,
      ...repertoireInsertion,
      ...dbRehearsalInsertions,
      ...rehearsalCalendarInsertions,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

// Update the project

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    projectId,
    payload,
  }: { projectId: string; payload: Record<string, string> } =
    await request.json();

  // the type is imperfect "musicians" is an array, musicians_structure is a JSON object # to update later

  if (payload.date)
    payload.date = new Date(payload.date as string).toISOString();

  try {
    await supabase.from("projects").update(payload).eq("id", projectId);

    if (payload.google_calendar_id)
      await updateCalendarEvent(payload.google_calendar_id, {
        summary: payload.name ?? undefined,
        description: payload.google_calendar_description ?? undefined,
        location: payload.location ?? undefined,
        start: {
          date: format(new Date(payload.date), "yyyy-MM-dd"),
        },
        end: {
          date: format(new Date(payload.date), "yyyy-MM-dd"),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

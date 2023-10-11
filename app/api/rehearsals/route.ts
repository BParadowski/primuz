import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteCalendarEvent, newCalendarEvent } from "@/lib/calendar";

export async function POST(request: Request) {
  const supabase = createServerComponentClient({ cookies });

  const data = await request.json();

  try {
    await supabase.from("rehearsals").insert(data);

    const projectName = await supabase
      .from("projects")
      .select("name")
      .eq("id", data.project_id)
      .single()
      .then(({ data }) => data && data.name);

    await newCalendarEvent({
      id: data.google_calendar_id,
      summary: `Próba do: "${projectName}"`,
      description: data.description,
      location: data.location,
      start: {
        dateTime: data.start_datetime,
      },
      end: {
        dateTime: data.end_datetime,
      },
      colorId: "1",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error at rehearsal insertion ---> ", error);
    return NextResponse.json({ success: false });
  }
}

export async function DELETE(request: Request) {
  const supabase = createServerComponentClient({ cookies });
  const data = await request.json();

  try {
    await supabase.from("rehearsals").delete().eq("id", data.id);

    await deleteCalendarEvent(data.calendarId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error at rehearsal deletion --->", error);
    return NextResponse.json({ success: false });
  }
}

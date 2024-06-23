import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  deleteCalendarEvent,
  newCalendarEvent,
  updateCalendarEvent,
} from "@/lib/calendar";
import { Database } from "@/lib/supabase";
import { getCalendarId } from "@/lib/apiFunctions";

export async function POST(request: Request) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const data = await request.json();

  try {
    await supabase.from("rehearsals").insert(data);

    const projectName = await supabase
      .from("projects")
      .select("name")
      .eq("id", data.project_id)
      .single()
      .then(({ data }) => data && data.name);

    try {
      var calendarId = await getCalendarId(supabase);
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: err,
      });
    }

    await newCalendarEvent(
      {
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
      },
      calendarId,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error at rehearsal insertion ---> ", error);
    return NextResponse.json({ success: false });
  }
}

export async function DELETE(request: Request) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const data = await request.json();

  try {
    await supabase.from("rehearsals").delete().eq("id", data.id);

    try {
      var calendarId = await getCalendarId(supabase);
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: err,
      });
    }

    const eventCalendarId = data.calendarId;

    await deleteCalendarEvent(eventCalendarId, calendarId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error at rehearsal deletion --->", error);
    return NextResponse.json({ success: false });
  }
}

// {
//         rehearsalId: data.id,
//         calendarId: data.calendarId,
//         payload: {
//           description: data.description,
//           start_datetime: data.start,
//           end_datetime: data.end,
//           location: data.location,
//         },
//       }

export async function PATCH(request: Request) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const data = await request.json();

  try {
    await supabase
      .from("rehearsals")
      .update(data.payload)
      .eq("id", data.rehearsalId);

    const projectName = await supabase
      .from("projects")
      .select("name")
      .eq("id", data.projectId)
      .single()
      .then(({ data }) => data && data.name);

    const event = {
      summary: `Próba do: "${projectName}"`,
      location: data.payload.location,
      description: data.payload.description,
      start: {
        dateTime: data.payload.start_datetime,
      },
      end: {
        dateTime: data.payload.end_datetime,
      },
    };

    const eventCalendarId = data.calendarId;

    try {
      var calendarId = await getCalendarId(supabase);
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: err,
      });
    }

    await updateCalendarEvent(eventCalendarId, event, calendarId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error at rehearsal edition --->", error);
    return NextResponse.json({ success: false });
  }
}

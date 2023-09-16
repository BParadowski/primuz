import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

const credentials = JSON.parse(process.env.CALENDAR_CREDENTIALS ?? "");
const calendarId = process.env.CALENDAR_ID;
const calendar = google.calendar({ version: "v3" });

const auth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

// npm i encoding

export async function POST(request: Request) {
  const formData = await request.formData();

  let event = {
    summary: `Marmolada`,
    description: `Marmobo`,
    location: "Sala nr 12 akademii muzycznej w łodzi",
    start: {
      date: String(formData.get("start")),
    },
    end: {
      date: String(formData.get("start")),
    },
  };

  const params = {
    auth: auth,
    calendarId: calendarId,
    requestBody: event,
  };

  try {
    let res = await calendar.events.insert(params);

    if (res.status == 200 && res.statusText === "OK") {
      console.log(res.data.htmlLink, res.data.id);
      return NextResponse.json({ success: "true" });
    } else {
      return NextResponse.json({ success: "false" });
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return NextResponse.json({ success: "false" });
  }
}

export async function GET(request: Request) {
  const id = request;
}

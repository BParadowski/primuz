import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { NextResponse, NextRequest } from "next/server";

const credentials = JSON.parse(process.env.CALENDAR_CREDENTIALS ?? "");
const calendarId = process.env.CALENDAR_ID;
const calendar = google.calendar({ version: "v3" });

export async function POST(request: NextRequest) {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const event = await request.json();

  const params = {
    auth: auth,
    calendarId: calendarId,
    requestBody: event,
  };

  try {
    const res = await calendar.events.insert(params);

    if (res.status == 200 && res.statusText === "OK") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return NextResponse.json({ success: false });
  }
}

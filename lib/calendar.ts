import { google, calendar_v3 } from "googleapis";
import { JWT } from "google-auth-library";

const credentials = JSON.parse(process.env.CALENDAR_CREDENTIALS ?? "");
const calendar = google.calendar({ version: "v3" });

export async function newCalendarEvent(
  event: calendar_v3.Schema$Event,
  calendarId: string,
) {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const params = {
    auth: auth,
    calendarId: calendarId,
    requestBody: event,
  };

  try {
    const res = await calendar.events.insert(params);

    if (res.status == 200 && res.statusText === "OK") {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return { success: false, error };
  }
}

export async function updateCalendarEvent(
  eventId: string,
  event: calendar_v3.Schema$Event,
  calendarId: string,
) {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const params = {
    auth: auth,
    eventId: eventId,
    calendarId: calendarId,
    requestBody: event,
  };

  try {
    const res = await calendar.events.update(params);

    if (res.status == 200 && res.statusText === "OK") {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(`Error at updateEvent --> ${error}`);
    return { success: false, error };
  }
}

export async function deleteCalendarEvent(eventId: string, calendarId: string) {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const params = {
    auth: auth,
    eventId: eventId,
    calendarId: calendarId,
  };

  try {
    const res = await calendar.events.delete(params);

    if (res.status == 200 && res.statusText === "OK") {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error}`);
    return { success: false, error };
  }
}

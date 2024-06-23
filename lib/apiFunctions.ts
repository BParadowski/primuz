import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

export async function getCalendarId(supabase: SupabaseClient<Database>) {
  const calendarId = await supabase
    .from("config")
    .select("value")
    .eq("id", "calendar_id")
    .single()
    .then(({ data }) => data?.value);

  if (!calendarId) {
    throw new Error("Error reading ID from the database.");
  }

  return calendarId;
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "@/public/supabase";

export default async function Profile() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: profiles } = await supabase.from("users").select().csv();

  return (
    <main className="grid place-content-center">
      <p>{profiles}</p>
      <h1>Congratulations this is the profile</h1>
    </main>
  );
}

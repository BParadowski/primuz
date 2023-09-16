import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "@/public/supabase";

export default async function Profile() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("user_id, first_name, last_name, instrument")
    .eq("user_id", user?.id ?? "")
    .limit(1)
    .single();

  const { user_id, first_name, last_name, instrument } = userData || {};

  return (
    <main className="grid place-content-center">
      <h1>Congratulations this is the profile</h1>
      <form className="flex flex-col gap-3" method="post" action="/api/users">
        <input
          defaultValue={user?.id}
          name="userId"
          className="hidden"
          readOnly
        />
        <input
          name="firstName"
          type="text"
          defaultValue={first_name ?? ""}
          className="bg-slate-500"
        />
        <input
          name="lastName"
          type="text"
          defaultValue={last_name ?? ""}
          className="bg-slate-500"
        />
        <select
          defaultValue={instrument ?? ""}
          className="bg-slate-500"
          name="instrument"
        >
          <option value="">Proszę wybrać instrument</option>
          <option value="skrzypce">skrzypce</option>
          <option value="altówka">altówka</option>
          <option value="wiolonczela">wiolonczela</option>
          <option value="kontrabas">kontrabas</option>
        </select>

        <button>Zapisz dane</button>
      </form>
    </main>
  );
}

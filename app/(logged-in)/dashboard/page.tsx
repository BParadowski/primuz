import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "@/public/supabase";

export default async function Profile() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const user = await supabase.auth
    .getSession()
    .then(({ data: { session } }) => session?.user);

  return (
    <main className="grid place-content-center">
      <h1>this is only for admins</h1>
    </main>
  );
}

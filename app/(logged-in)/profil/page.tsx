import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import UserDataForm from "@/components/project/userForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("user_id, first_name, last_name, instrument")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const instruments = await supabase
    .rpc("get_instruments")
    .then(({ data }) => data);

  if (!userData)
    return (
      <main>
        <div className="container">
          <p> Podczas ładowania strony wystąpił błąd</p>
        </div>
      </main>
    );

  return (
    <main className="grid place-content-center">
      <div className="container">
        <UserDataForm
          userId={userData.user_id}
          firstName={userData.first_name ?? ""}
          lastName={userData.last_name ?? ""}
          instrument={userData.instrument}
          allInstruments={
            instruments as Database["public"]["Enums"]["instrument"][]
          }
        />
      </div>
    </main>
  );
}

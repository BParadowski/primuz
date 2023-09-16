import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const userId = await (await supabase.auth.getSession()).data.session?.user.id;

  const data = (
    await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("user_id", userId ?? "")
      .single()
  ).data;
  const firstName = data?.first_name;
  const lastName = data?.last_name;

  return (
    <>
      <header>
        <p className="bg-slate-400 rounded-lg">
          Cześć, {`${firstName} ${lastName}`}
        </p>
        <form method="post">
          <button formAction="/auth/logout">Log out</button>
        </form>
      </header>
      {children}
      <footer>Nothing to see here</footer>
    </>
  );
}

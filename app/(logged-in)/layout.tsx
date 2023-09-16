import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import sygnet from "@lib/primuz-sygnet.svg";

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
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="bg-slate-100">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/">
            <Image
              alt="Sygnet orkiestry Primuz"
              src={sygnet}
              className="w-20"
            />
          </Link>
          <p className="text-sm italic">{`${firstName} ${lastName}`}</p>

          <form method="post" action="/auth/logout">
            <button className="rounded-lg border-2 border-solid border-slate-700 bg-slate-400">
              Wyloguj
            </button>
          </form>
          <Link href="/admin/projekty">Panel sterowania</Link>
          <Link href="/profil">Ustawienia</Link>
        </div>
      </header>
      {children}
      <footer className="bg-slate-100">
        <div className="container py-4">Tak, ta stron używa cookies.</div>
      </footer>
    </div>
  );
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import sygnet from "@/lib/images/primuz-sygnet.svg";
import { Button } from "@/components/ui/button";

export default async function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

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
      <header className="relative bg-primary">
        <div className="container flex items-center gap-4 py-4 text-primary-foreground">
          <Link href="/">
            <Image
              alt="Sygnet orkiestry Primuz"
              src={sygnet}
              className="w-12"
              priority
            />
          </Link>
          <p className="text-sm italic">{`${firstName} ${lastName}`}</p>

          <nav className="ml-auto hidden sm:flex">
            <ul className="flex flex-wrap gap-4">
              <li>
                <Button variant="whiteLink" asChild>
                  <Link href="/admin/projekty">Panel sterowania</Link>
                </Button>
              </li>
              <li>
                {" "}
                <Button variant="whiteLink" asChild>
                  <Link href="/profil">Ustawienia</Link>
                </Button>
              </li>
              <li>
                <Button variant="whiteLink">
                  <form method="post" action="/auth/logout">
                    Wyloguj
                  </form>
                </Button>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-0 left-0 h-px w-full bg-muted-foreground" />
        </div>
      </header>
      {children}
      <footer className="bg-primary">
        <div className="container py-4 text-primary-foreground">
          Tak, ta stron używa cookies.
        </div>
      </footer>
    </div>
  );
}

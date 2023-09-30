"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import sygnet from "@/lib/images/primuz-sygnet.svg";
import { Button } from "@/components/ui/button";
import runOneSignal from "@/lib/onesignal";
import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { useRouter } from "next/navigation";
import { RefreshCwIcon } from "lucide-react";

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function pushNotifications() {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      await runOneSignal();
      // user must be logged in otherwise middleware would have redirected them
      try {
        await OneSignal.login(userId!);
      } catch (err) {
        console.error(err);
      }
    }
    pushNotifications();
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="relative bg-primary">
        <div className="container flex items-center gap-4 py-4 text-primary-foreground">
          <Link href="/projekty">
            <Image
              alt="Sygnet orkiestry Primuz"
              src={sygnet}
              className="w-12"
              priority
            />
          </Link>
          <p className="text-sm italic">Primuz</p>

          <nav className="ml-auto hidden sm:flex">
            <ul className="flex flex-wrap items-center gap-4">
              <li onClick={() => router.refresh()} className="cursor-pointer">
                <RefreshCwIcon className="stroke-white" />
              </li>
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
                <Button
                  variant="whiteLink"
                  onClick={async () => {
                    try {
                      await OneSignal.logout();
                    } finally {
                      await fetch("/auth/logout", { method: "post" });
                      router.refresh();
                    }
                  }}
                >
                  Wyloguj
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

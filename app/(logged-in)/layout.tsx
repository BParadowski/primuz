"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import sygnet from "@/lib/images/primuz-sygnet.svg";
import { Button } from "@/components/ui/button";
import runOneSignal from "@/lib/onesignal";
import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { useRouter } from "next/navigation";
import { RotateCwIcon } from "lucide-react";
import MobileNav from "@/components/mobileNav";

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [adminMenu, setAdminMenu] = useState(false);

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

    async function enableAdminMenu() {
      const isUserAdmin = (await supabase.rpc("is_admin")).data;
      if (isUserAdmin) setAdminMenu(true);
    }

    enableAdminMenu();
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto] md:grid-rows-[auto_1fr_auto]">
      <header className="fixed left-0 right-0 z-50 bg-primary md:relative">
        <div className="container flex items-center gap-4 py-4 text-primary-foreground">
          <Link href="/projekty">
            <Image
              alt="Sygnet orkiestry Primuz"
              src={sygnet}
              className="w-12"
              priority
            />
          </Link>

          <nav className="ml-auto hidden md:flex">
            <button
              onClick={() => location.reload()}
              className="ml-auto mr-4 flex cursor-pointer items-center rounded-sm border 
              border-solid border-primary-foreground p-2 hover:bg-white hover:bg-opacity-25"
            >
              odświerz
              <RotateCwIcon
                className="ml-2 stroke-primary-foreground"
                height={20}
                width={20}
              />
            </button>
            <ul className="flex flex-wrap items-center gap-4">
              {adminMenu && (
                <li>
                  <Button variant="whiteLink" asChild>
                    <Link href="/admin/projekty">Administracja</Link>
                  </Button>
                </li>
              )}
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
          <button
            onClick={() => location.reload()}
            className="ml-auto flex cursor-pointer items-center rounded-sm border
             border-solid border-primary-foreground p-2 md:hidden"
          >
            odświerz
            <RotateCwIcon
              className="ml-2 stroke-primary-foreground"
              height={20}
              width={20}
            />
          </button>
          <MobileNav
            adminMenu={adminMenu}
            onLogOut={async () => {
              try {
                await OneSignal.logout();
              } finally {
                await fetch("/auth/logout", { method: "post" });
                router.refresh();
              }
            }}
          />
          <div className="absolute bottom-0 left-0 h-px w-full bg-muted-foreground" />
        </div>
      </header>
      {children}
      <footer className="bg-primary">
        <div className="container py-4 text-primary-foreground">
          Bartosz Paradowski 2023©.
        </div>
      </footer>
    </div>
  );
}

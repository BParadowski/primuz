import Image from "next/image";
import logo from "@/lib/images/primuz-logo-home.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import androidLogo from "@/lib/images/Android_robot.svg.png";
import appleLogo from "@/lib/images/Apple_logo_grey.svg";
import appleShare from "@/lib/images/Share-apple.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVerticalIcon } from "lucide-react";

export default function Home({
  searchParams,
}: {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) {
  return (
    <main className="grid place-content-center gap-y-3">
      <Image
        src={logo}
        alt="Primuz Chamber Orchestra logo"
        className="max-w-xs"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="standalone:hidden place-self-center"
          >
            Jak zainstalować?
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-4">
              <Image alt="" src={androidLogo} className="w-8" />
              Android
            </DialogTitle>
            <DialogDescription asChild>
              <ol>
                <li className="flex items-center gap-1">
                  1. W prawym górnym rogu paska adresu kliknij Menu{" "}
                  <MoreVerticalIcon />.
                </li>
                <li>
                  2. Znajdź i kliknij{" "}
                  <span className="font-bold">Dodaj do ekranu głównego</span>.
                </li>
              </ol>
            </DialogDescription>
            <DialogTitle className="flex items-center gap-4 ">
              <Image alt="" src={appleLogo} className="w-8" />
              iOS
            </DialogTitle>
            <DialogDescription asChild>
              <ol>
                <li className="flex items-center gap-1">
                  1. W prawym górnym rogu paska adresu kliknij Udostępnij{" "}
                  <Image
                    alt=""
                    src={appleShare}
                    className="w-8 fill-stone-500"
                  />
                  .
                </li>
                <li>
                  2. Znajdź i kliknij{" "}
                  <span className="font-bold">Dodaj do ekranu głównego</span>.
                </li>
              </ol>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <form action="/auth/login" method="post" className="flex flex-col gap-4">
        <Label className="flex flex-col" htmlFor="email">
          Email
        </Label>
        <Input name="email" id="email" />

        <Label htmlFor="password">Hasło</Label>
        <Input type="password" name="password" id="password" />

        <Button className="place-self-center" variant="outline" size="lg">
          Zaloguj
        </Button>
      </form>
      {Boolean(searchParams?.error) && (
        <p className="text-red-400">Niewłaściwy email lub hasło</p>
      )}
    </main>
  );
}

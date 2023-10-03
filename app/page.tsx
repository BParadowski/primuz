import Image from "next/image";
import logo from "@/lib/images/primuz-logo-home.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home({
  searchParams,
}: {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) {
  return (
    <main className="grid place-content-center">
      <Image
        src={logo}
        alt="Primuz Chamber Orchestra logo"
        className="max-w-xs"
      />
      <form action="/auth/login" method="post" className="flex flex-col gap-4">
        <Label className="flex flex-col" htmlFor="email">
          Email
        </Label>
        <Input name="email" id="email" />

        <Label htmlFor="password">Hasło</Label>
        <Input type="password" name="password" id="password" />

        <button>Zaloguj</button>
      </form>
      {Boolean(searchParams?.error) && (
        <p className="text-red-400">Niewłaściwy email lub hasło</p>
      )}
    </main>
  );
}

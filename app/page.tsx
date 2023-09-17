import Image from "next/image";
import logo from "@/lib/images/primuz-logo-home.png";

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
        <label className="flex flex-col">
          Email
          <input name="email" />
        </label>
        <label htmlFor="password">
          Hasło <input type="password" name="password" />
        </label>

        <button>Sign In</button>
      </form>
      {Boolean(searchParams?.error) && (
        <p className="text-red-400">Niewłaściwy email lub hasło</p>
      )}
    </main>
  );
}

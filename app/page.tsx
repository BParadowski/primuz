import Image from "next/image";
import logo from "/public/primuz-logo-home.png";

export default function Home() {
  return (
    <main className="grid place-content-center">
      <Image
        src={logo}
        alt="Primuz Chamber Orchestra logo"
        className="max-w-xs"
      />
      <form action="/auth/login" method="post">
        <label htmlFor="email">Email</label>
        <input name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        <button>Sign In</button>
      </form>
    </main>
  );
}

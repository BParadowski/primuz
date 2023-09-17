"use client";

import Image from "next/image";
import Link from "next/link";
import addProject from "@/lib/images/add-project.svg";

export default function Profile() {
  return (
    <main className="relative bg-orange-100 p-10">
      <h1 className="text-center text-xl">Projekty</h1>
      <Link href="/admin/nowy-projekt" className="absolute left-6 top-6">
        <Image src={addProject} alt="Ikona dodawania nowego projektu" />
      </Link>
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  return (
    <main className="relative bg-orange-100 p-10">
      <h1 className="text-center text-xl">Projekty</h1>
      <Button
        onClick={async () => {
          const res = await fetch("/api/notifications", { method: "post" });
          console.log(await res.json());
        }}
      >
        hit the api
      </Button>
    </main>
  );
}

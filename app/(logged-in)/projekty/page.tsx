import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Projects() {
  const supabase = createServerComponentClient({ cookies });
  const projectsData = await supabase.from("projects").select("");

  return (
    <main className="relative bg-orange-100 p-10">
      <h1 className="text-center text-xl">Projekty</h1>
    </main>
  );
}

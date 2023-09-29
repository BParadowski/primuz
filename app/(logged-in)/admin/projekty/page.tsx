import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import Link from "next/link";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("projects_summary").select();

  return (
    <main className="relative bg-orange-100 p-10">
      <h1 className="text-center text-xl">Projekty</h1>
      {data &&
        data.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projekty/${project.id}`}
            className="rounded-xl border border-solid border-black p-2"
          >
            {project.name}
          </Link>
        ))}
    </main>
  );
}

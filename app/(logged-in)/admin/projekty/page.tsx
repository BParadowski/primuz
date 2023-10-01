import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("projects_summary").select();

  return (
    <main className="relative  p-10">
      <h1 className="py-8 text-center text-xl font-bold">Projekty</h1>
      <div className="flex flex-col gap-2">
        {data &&
          data.map((project) => (
            <Link
              key={project.id}
              href={`/admin/projekty/${project.id}`}
              className="rounded-xl border border-solid border-black p-2 hover:bg-stone-100"
            >
              {project.name}
            </Link>
          ))}
      </div>
    </main>
  );
}

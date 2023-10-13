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
    <main className="relative bg-background">
      <div className="container  py-10">
        <h1 className="py-8 text-center text-xl font-bold">Projekty</h1>
        <div className="flex flex-col gap-4">
          {data &&
            data.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projekty/${project.id}`}
                className="rounded-sm border border-solid border-border p-2 shadow-sm hover:bg-stone-100"
              >
                {project.name}
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

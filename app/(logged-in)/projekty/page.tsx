import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import ProjectCard from "@/components/projects-page/ProjectCard";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("projects_summary").select();

  return (
    <main className="mt-[--header-height] grid md:mt-0">
      <div className="container mt-4 grid">
        <div className="flex flex-col gap-6 rounded-lg py-4">
          <h1 className="py-2 text-center text-2xl font-bold sm:py-4">
            Projekty
          </h1>
          {data?.map((projectData) => (
            <ProjectCard projectData={projectData} key={projectData.id} />
          ))}
        </div>
      </div>
    </main>
  );
}

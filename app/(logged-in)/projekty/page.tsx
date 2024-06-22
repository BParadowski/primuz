import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import ProjectCard from "@/components/projects-page/ProjectCard";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const userId = (await supabase.auth.getSession()).data.session?.user.id;
  if (!userId) return;

  const theDayBeforeYesterday = new Date(
    new Date().setDate(new Date().getDate() - 2),
  ).toISOString();

  const { data } = await supabase
    .from("availability")
    .select("status, message, projects!inner(id, date, name, location)")
    .eq("user_id", userId)
    .gte("projects.date", theDayBeforeYesterday)
    .order("projects(date)", { ascending: true });

  return (
    <main className="mt-[--header-height] grid md:mt-0">
      <div className="container mt-4 grid">
        <div className="flex flex-col gap-6 rounded-lg py-4">
          <h1 className="py-2 text-center text-2xl font-bold sm:py-4">
            Projekty
          </h1>
          {data?.map((projectData) => {
            const { status, message, projects: project } = projectData;

            return (
              <ProjectCard
                projectData={{ status, message, ...project }}
                key={project.id}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

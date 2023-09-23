import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import { format } from "date-fns/esm";
import { pl } from "date-fns/locale";
import Link from "next/link";
import AvailabilityIcon from "@/components/project/availabilityIcon";
import AvailabilityStatusDescription from "@/components/project/availabilityStatusDescription";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("projects_summary").select();

  return (
    <main className="grid bg-primary">
      <div className="container mt-4 grid">
        <div className="flex flex-col gap-6 rounded-lg bg-muted px-6 py-4">
          <h1 className="py-4 text-center text-2xl font-bold">Projekty</h1>
          {data?.map((projectData) => {
            let statusDescription;
            switch (projectData.status) {
              case "available":
                statusDescription = "Dostępny/a";
                break;
              case "unavailable":
                statusDescription = "Niedostępny/a";
                break;
              case "maybe":
                statusDescription = "Może";
                break;
              case "undeclared":
                statusDescription = "Dostępność niezadeklarowana";
                break;
            }
            return (
              <Link href={`/projekty/${projectData.id}`} key={projectData.id}>
                <div className="border-accent-forground rounded-lg border border-solid px-6 py-4 hover:bg-stone-200">
                  <h2 className="text-xl font-bold">{projectData.name}</h2>
                  <p>
                    {format(new Date(projectData.date), "PPP (EEEE)", {
                      locale: pl,
                    })}
                  </p>
                  <p>{projectData.location}</p>
                  <div className="align-center mt-4 flex gap-4">
                    <AvailabilityIcon status={projectData.status} selected />
                    <AvailabilityStatusDescription
                      status={projectData.status}
                    />
                    {projectData.message ? (
                      <p className="italic text-muted-foreground">
                        ({projectData.message})
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

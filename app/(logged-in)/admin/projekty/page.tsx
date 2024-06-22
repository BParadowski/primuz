import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";
import Link from "next/link";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { pl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("projects")
    .select("id, name, date")
    .order("date");
  const currentTime = new Date().getTime();

  return (
    <main className="relative bg-background">
      <div className="container  py-10">
        <h1 className="py-8 text-center text-xl font-bold">Projekty</h1>
        <div className="flex flex-col gap-4">
          {data &&
            data
              .filter(
                (project) => new Date(project.date).getTime() > currentTime,
              )
              .map((project) => {
                return (
                  <Link
                    key={project.id}
                    href={`/admin/projekty/${project.id}`}
                    className="rounded-sm border border-solid border-border p-2 shadow-sm hover:bg-stone-100"
                  >
                    <div className="flex">
                      <p>{project.name}</p>
                      <p className="ml-auto">
                        {formatInTimeZone(
                          new Date(project.date),
                          "Europe/Warsaw",
                          "PPP",
                          { locale: pl },
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
          {data &&
            data.find(
              (project) => new Date(project.date).getTime() < currentTime,
            ) && <h2 className="mt-10 text-muted-foreground">Archiwum</h2>}
          {data &&
            data
              .filter(
                (project) => new Date(project.date).getTime() < currentTime,
              )
              .map((project) => {
                return (
                  <Link
                    key={project.id}
                    href={`/admin/projekty/${project.id}`}
                    className="rounded-sm border border-solid border-border p-2 opacity-70 shadow-sm hover:bg-stone-100"
                  >
                    <div className="flex">
                      <p>{project.name}</p>
                      <p className="ml-auto">
                        {formatInTimeZone(
                          new Date(project.date),
                          "Europe/Warsaw",
                          "PPP",
                          { locale: pl },
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </main>
  );
}

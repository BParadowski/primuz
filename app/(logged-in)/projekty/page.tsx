import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase";

export default async function Projects() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("projects_summary").select();

  return (
    <main className="">
      <div className="container">
        <h1 className="text-center text-2xl font-bold">Projekty</h1>
        {data?.map((projectData, i) => (
          <div
            key={i}
            className="border-accent-forground rounded-lg border border-solid px-6 py-4"
          >
            <h2 className="text-xl font-medium">{projectData.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

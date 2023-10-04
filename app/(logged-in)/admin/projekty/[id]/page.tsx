import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EnsamblePicker from "@/components/admin/ensamblePicker";

export default async function Project({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("projects")
    .select()
    .eq("id", params.id)
    .single();

  if (!data) return <div>Nie udało się znaleźć strony projektu</div>;

  //@ts-expect-error
  const instruments: Instruments[] = (await supabase.rpc("get_instruments"))
    .data;

  return (
    <main className="relative p-10">
      <div className="container">
        <h1 className="pb-8 text-center text-2xl font-bold">{data.name}</h1>

        <EnsamblePicker projectId={params.id} projectName={data.name} />
      </div>
    </main>
  );
}

import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EnsamblePicker from "@/components/admin/ensamblePicker";
import RepertoireUpdater from "@/components/admin/repertoireUpdater";
import Announcer from "@/components/admin/announcer";

export default async function Project({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("projects")
    .select()
    .eq("id", params.id)
    .single();

  const { data: repertoireData } = await supabase
    .from("projects_pieces")
    .select("pieces(*)")
    .eq("project_id", params.id);

  const piecesArray = [];
  if (repertoireData)
    for (let data of repertoireData) {
      if (data.pieces) piecesArray.push(data.pieces);
    }

  if (!data) return <div>Nie udało się znaleźć strony projektu</div>;

  //@ts-expect-error
  const instruments: Instruments[] = (await supabase.rpc("get_instruments"))
    .data;

  return (
    <main className="relative p-10">
      <div className="container">
        <h1 className="pb-8 text-center text-2xl font-bold">{data.name}</h1>

        <EnsamblePicker projectId={params.id} projectName={data.name} />
        <h2 className="mt-6 py-4 text-center text-lg font-bold">Ogłoszenia</h2>
        <Announcer projectId={params.id} projectMusicians={data.musicians} />

        <h2 className="mt-6 py-4 text-center text-lg font-bold">Repertuar</h2>
        <RepertoireUpdater
          initialRepertoire={piecesArray}
          projectId={params.id}
        />
      </div>
    </main>
  );
}

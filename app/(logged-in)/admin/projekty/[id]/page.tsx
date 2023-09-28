import AvailabilityIcon from "@/components/project/availabilityIcon";
import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AvailabilityRow from "@/components/admin/availabilityRow";
import EnsamblePicker from "@/components/admin/ensamblePicker";

export default async function Project({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("projects")
    .select()
    .eq("id", params.id)
    .single();

  const { data: availabilityData } = await supabase
    .from("sorted_musicians_availability")
    .select()
    .eq("project_id", params.id);

  if (!data || !availabilityData)
    return <div>Nie udało się znaleźć strony projektu</div>;

  //@ts-expect-error
  const instruments: Instruments[] = (await supabase.rpc("get_instruments"))
    .data;

  return (
    <main className="relative p-10">
      <div className="container">
        <h1 className="text-center text-xl">{data.name}</h1>

        <EnsamblePicker projectId={params.id} />
      </div>
    </main>
  );
}

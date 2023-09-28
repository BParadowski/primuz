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
        <div>
          {" "}
          {instruments.map((instrument) => {
            if (
              !availabilityData.find((data) => data.instrument === instrument)
            )
              return null;
            else
              return (
                <div key={instrument}>
                  <h3 className="font-bold capitalize">{instrument}</h3>
                  <div className="flex flex-col gap-2">
                    {availabilityData
                      .filter((data) => data.instrument === instrument)
                      .map((avData) => {
                        return (
                          <AvailabilityRow
                            key={avData.user_id}
                            userId={avData.user_id}
                            availabilityStatus={avData.status}
                            availabilityMessage={avData.message}
                            firstName={avData.first_name}
                            lastName={avData.last_name}
                          />
                        );
                      })}
                  </div>
                </div>
              );
          })}
        </div>
        <EnsamblePicker projectId={params.id} />
      </div>
    </main>
  );
}

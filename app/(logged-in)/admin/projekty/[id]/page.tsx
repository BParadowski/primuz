import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EnsamblePicker from "@/components/admin/ensamblePicker";
import RepertoireUpdater from "@/components/admin/repertoireUpdater";
import Announcer from "@/components/admin/announcer";
import InfoUpdater from "@/components/admin/projectInfoUpdater";
import AddRehearsalDialog from "@/components/admin/addRehearsalDialog";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import pl from "date-fns/locale/pl";
import DeleteRehearsalPopup from "@/components/admin/deleteRehearsalPopup";
import EditRehearsalDialog from "@/components/admin/editRehearsalDialog";

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

  const { data: rehearsalsData } = await supabase
    .from("rehearsals")
    .select()
    .eq("project_id", params.id)
    .order("start_datetime", { ascending: true });

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
    <main className="relative py-10">
      <div className="container">
        <div className="grid gap-6">
          <h1 className="pb-8 text-center text-2xl font-bold">{data.name}</h1>

          <div>
            <EnsamblePicker projectId={params.id} projectName={data.name} />
          </div>

          <div>
            <h2 className="py-4 text-center text-lg font-bold">Ogłoszenia</h2>
            <Announcer
              projectId={params.id}
              projectMusicians={data.musicians}
            />
          </div>

          <div>
            <h2 className="py-4 text-center text-lg font-bold">Repertuar</h2>
            <RepertoireUpdater
              initialRepertoire={piecesArray}
              projectId={params.id}
            />
          </div>

          <div>
            <h2 className="py-4 text-center text-lg font-bold">Próby</h2>
            <AddRehearsalDialog projectId={params.id} />
          </div>

          <div className="grid gap-y-4">
            {rehearsalsData && rehearsalsData.length > 0 ? (
              rehearsalsData.map((rehearsal) => {
                return (
                  <div
                    key={rehearsal.id}
                    className="rounded-sm border border-solid border-border bg-background px-4 py-4 shadow-sm"
                  >
                    <h2 className="text-lg font-bold">
                      {formatInTimeZone(
                        new Date(rehearsal.start_datetime),
                        "Europe/Warsaw",
                        "d MMMM (EEEE)",
                        {
                          locale: pl,
                        },
                      )}
                    </h2>
                    <div>
                      {formatInTimeZone(
                        new Date(rehearsal.start_datetime),
                        "Europe/Warsaw",
                        "p",
                        {
                          locale: pl,
                        },
                      ) +
                        "-" +
                        formatInTimeZone(
                          new Date(rehearsal.end_datetime),
                          "Europe/Warsaw",
                          "p",
                          {
                            locale: pl,
                          },
                        )}

                      <p className="mt-2 italic">{rehearsal.location ?? " "}</p>
                      <pre className="mt-2 opacity-70">
                        {rehearsal.description ?? " "}
                      </pre>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <EditRehearsalDialog
                        rehearsal={rehearsal}
                        projectId={params.id}
                      />
                      <DeleteRehearsalPopup
                        projectId={params.id}
                        id={rehearsal.id}
                        calendarId={rehearsal.google_calendar_id}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">--brak prób--</p>
            )}
          </div>

          <div>
            <h2 className="py-4 text-center text-lg font-bold">
              Edytuj informacje
            </h2>
            <InfoUpdater
              id={data.id}
              name={data.name}
              location={data.location ?? undefined}
              calendarId={data.google_calendar_id}
              date={data.date}
              calendarDescription={
                data.google_calendar_description ?? undefined
              }
              pay={data.pay ?? undefined}
              description={data.description ?? undefined}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

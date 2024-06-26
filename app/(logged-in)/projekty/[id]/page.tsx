import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { pl } from "date-fns/locale";
import {
  MapPinIcon,
  CalendarIcon,
  CircleDollarSignIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import map from "@/lib/google-maps.png";
import AvailabilityPicker from "@/components/project/availabilityPicker";
import AvailabilityIcon from "@/components/project/availabilityIcon";
import { ListOfPieces } from "@/components/project/listOfPieces";
import { sortByInstrument } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import ClientDate from "@/components/project/clientDatePara";

// object used to sort orchestral sections
type Instruments = Database["public"]["Enums"]["instrument"];

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const dataQuery = supabase
    .from("projects")
    .select("name, location, description, pay, date, musicians_structure")
    .eq("id", params.id)
    .single()
    .then(({ data }) => data);

  const rehearsalQuery = supabase
    .from("rehearsals")
    .select()
    .eq("project_id", params.id)
    .order("start_datetime")
    .then(({ data }) => data);

  const userQuery = supabase.auth
    .getSession()
    .then(({ data: { session } }) => session?.user);

  const availabilityQuery = supabase
    .from("availability")
    .select(
      "status, message, project_id, user_id, users!inner(instrument, first_name, last_name)",
    )
    .eq("project_id", params.id)
    .order("users(first_name)")
    .then(({ data }) => data);

  const announcementsQuery = supabase
    .from("announcements")
    .select()
    .eq("project_id", params.id)
    .order("created_at", { ascending: false })
    .then(({ data }) => (data && data.length > 0 ? data : null));

  //Need new db types to get rid of this error
  // @ts-expect-error
  const instrumentsQuery: Promise<Instruments[]> = supabase
    .rpc("get_instruments")
    .then(({ data }) => data);

  const [
    user,
    availabilityDataRaw,
    instruments,
    rehearsalsData,
    data,
    announcements,
  ] = await Promise.all([
    userQuery,
    availabilityQuery,
    instrumentsQuery,
    rehearsalQuery,
    dataQuery,
    announcementsQuery,
  ]);

  const availabilityData = availabilityDataRaw?.map(
    (availabilityAndUserData) => {
      const {
        message,
        status,
        project_id,
        user_id,
        users: { instrument, first_name, last_name },
      } = availabilityAndUserData;
      return {
        message,
        status,
        project_id,
        user_id,
        instrument,
        first_name,
        last_name,
      };
    },
  );

  // mainly for type narrowing, should never happen
  if (!data || !availabilityData || !user)
    return <div>Nie udało się załadować strony projektu</div>;

  const myAvailability = availabilityData.find(
    (availability) => availability.user_id === user.id,
  );

  return (
    <main className="mt-[--header-height] grid md:mt-0">
      <div className="container mt-4 grid">
        {/* Layout div */}
        <div className="grid gap-y-10 px-3 py-4 md:gap-y-14 lg:gap-y-16">
          <section className="flex flex-col justify-items-center gap-3">
            <h1 className="text-center text-2xl font-bold">{data.name}</h1>
            <div className="flex items-center gap-6">
              <MapPinIcon height={36} className="min-w-[1.5rem]" />
              <p>{data.location}</p>
              <Button variant="outline" asChild>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    data.location ?? "",
                  )}`}
                  target="_blank"
                >
                  <Image src={map} alt="" className="mr-3 max-h-full w-6" />
                  <p>Nawigacja</p>
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <CalendarIcon height={36} />
              {formatInTimeZone(
                new Date(data.date),
                "Europe/Warsaw",
                "PPP (EEEE)",
                { locale: pl },
              )}
            </div>
            {data.pay && (
              <div className="flex items-center gap-6">
                <CircleDollarSignIcon height={36} />
                <p>
                  {data.pay}
                  {data.pay?.match(/d+/gi) && (
                    <span className="ml-2">(brutto)</span>
                  )}
                </p>
              </div>
            )}
            {announcements ? (
              <div className="flex flex-col gap-2 py-4">
                {announcements.map((announcement) => (
                  <div
                    className="flex border border-solid border-accent bg-stone-50 px-3 py-2 shadow-sm"
                    key={announcement.id}
                  >
                    <AlertTriangleIcon className="min-w-[1rem]" />
                    <p className="ml-2">{announcement.description}</p>
                    <ClientDate date={new Date(announcement.created_at)} />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="grid grid-cols-[auto_1fr] gap-6">
              <div
                className="quill-html"
                dangerouslySetInnerHTML={{ __html: data.description ?? "" }}
              ></div>
            </div>
          </section>

          <section>
            <h2 className="py-6 text-center font-bold">Próby</h2>
            <div className="grid gap-y-2">
              {rehearsalsData && rehearsalsData.length > 0 ? (
                rehearsalsData.map((rehearsal) => {
                  return (
                    <div
                      key={rehearsal.id}
                      className="rounded-sm border border-solid border-border px-4 py-2"
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

                        <p className="mt-2 italic">
                          {rehearsal.location ?? " "}
                        </p>
                        <p className="mt-2 opacity-70">
                          {rehearsal.description ?? " "}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center">--brak prób--</p>
              )}
            </div>
          </section>
          <section>
            <h2 className="py-6 text-center font-bold">Twoja dostępność</h2>
            <AvailabilityPicker
              initialMessage={myAvailability?.message ?? ""}
              initialStatus={myAvailability?.status ?? "undeclared"}
              userId={user?.id ?? ""}
              projectId={params.id}
            />
          </section>
          <section className="grid lg:grid-cols-2 lg:gap-x-10">
            <div className="flex flex-col gap-2">
              <h2 className="py-6 text-center font-bold">Dostępność</h2>

              {instruments.map((instrument) => {
                if (
                  !availabilityData.find(
                    (data) => data.instrument === instrument,
                  )
                )
                  return null;
                else
                  return (
                    <div key={instrument}>
                      <h3 className="pb-2 font-bold capitalize">
                        {instrument}
                      </h3>
                      <div className="flex flex-col gap-2 pl-1">
                        {availabilityData
                          .filter((data) => data.instrument === instrument)
                          .map((avData) => {
                            return (
                              <div key={avData.user_id}>
                                <div className="flex gap-4 ">
                                  <p>{`${avData.first_name} ${avData.last_name}`}</p>
                                  <div className="ml-auto">
                                    <AvailabilityIcon
                                      status={avData.status}
                                      selected
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
              })}
            </div>
            <div>
              <h2 className="py-6 text-center font-bold">Skład</h2>

              {data.musicians_structure &&
                sortByInstrument(
                  Object.keys(data.musicians_structure as Object),
                ).map((section) => {
                  if (
                    (
                      data.musicians_structure as {
                        [K in string]: string[];
                      }
                    )[section].length === 0
                  )
                    return null;
                  return (
                    <div className="my-1 p-1" key={section}>
                      <h3 className="font-bold capitalize">{section}</h3>
                      <div>
                        {(
                          data.musicians_structure as {
                            [K in string]: string[];
                          }
                        )[section].map((musicianName) => {
                          return <p key={musicianName}>{musicianName}</p>;
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
          <section>
            <h2 className="py-6 text-center font-bold">Repertuar</h2>

            <ListOfPieces
              projectId={params.id}
              instrument={myAvailability?.instrument ?? "skrzypce"}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

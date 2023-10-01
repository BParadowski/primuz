import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { format } from "date-fns/esm";
import { pl } from "date-fns/locale";
import {
  MapPinIcon,
  CalendarIcon,
  CircleDollarSignIcon,
  ScrollTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import map from "@/lib/google-maps.png";
import AvailabilityPicker from "@/components/project/availabilityPicker";
import AvailabilityIcon from "@/components/project/availabilityIcon";
import { ListOfPieces } from "@/components/project/listOfPieces";
import { Separator } from "@/components/ui/separator";
import { sortByInstrument } from "@/lib/utils";

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
    .then(
      ({ data }) =>
        data?.sort((a, b) => (a.start_datetime > b.start_datetime ? 1 : -1)),
    );

  const userQuery = supabase.auth
    .getSession()
    .then(({ data: { session } }) => session?.user);

  const availabilityQuery = supabase
    .from("sorted_musicians_availability")
    .select()
    .eq("project_id", params.id)
    .then(({ data }) => data);

  //Need new db types to get rid of this error
  // @ts-expect-error
  const instrumentsQuery: Promise<Instruments[]> = supabase
    .rpc("get_instruments")
    .then(({ data }) => data);

  const [user, availabilityData, instruments, rehearsalsData, data] =
    await Promise.all([
      userQuery,
      availabilityQuery,
      instrumentsQuery,
      rehearsalQuery,
      dataQuery,
    ]);

  // mainly for type narrowing, should never happen
  if (!data || !availabilityData || !user)
    return <div>Nie udało się załadować strony projektu</div>;

  const myAvailability = availabilityData.find(
    (availability) => availability.user_id === user.id,
  );

  return (
    <main className="grid bg-primary">
      <div className="container mt-4 grid">
        <div className="flex flex-col justify-items-center gap-3 rounded-lg bg-background px-6 py-4">
          <h1 className="text-center text-2xl font-bold">{data.name}</h1>
          <div className="flex items-center gap-6">
            <MapPinIcon height={36} />
            <p>{data.location}</p>
            <Button variant="outline" asChild>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  data.location ?? "",
                )}`}
                target="_blank"
              >
                <Image src={map} alt="" className="mr-3 max-h-full w-6" />
                <p> Otwórz nawigację</p>
              </a>
            </Button>
          </div>
          <div className="flex items-center gap-6">
            <CalendarIcon height={36} />
            {format(new Date(data.date), "PPP (EEEE)", { locale: pl })}
          </div>
          <div className="flex items-center gap-6">
            <CircleDollarSignIcon height={36} />
            <p>
              {data.pay}
              <span className="ml-2">(brutto)</span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <ScrollTextIcon height={36} />
            <p>{data.description}</p>
          </div>
          <section>
            <h2 className="py-6 text-center font-bold">Próby</h2>
            <div className="grid gap-y-4 md:grid-cols-2 md:gap-x-4 xl:grid-cols-3">
              {rehearsalsData && rehearsalsData.length > 0
                ? rehearsalsData.map((rehearsal) => {
                    return (
                      <div
                        key={rehearsal.id}
                        className="rounded-xl border border-solid border-foreground bg-muted px-4 py-4"
                      >
                        <h2 className="text-lg font-bold">
                          {format(
                            new Date(rehearsal.start_datetime),
                            "d MMMM (EEEE)",
                            {
                              locale: pl,
                            },
                          )}
                        </h2>
                        <div>
                          {format(new Date(rehearsal.start_datetime), "p", {
                            locale: pl,
                          }) +
                            "-" +
                            format(new Date(rehearsal.end_datetime), "p", {
                              locale: pl,
                            })}

                          <p className="mt-2 italic">
                            {rehearsal.location ?? " "}
                          </p>
                          <pre className="mt-2 opacity-70">
                            {rehearsal.description ?? " "}
                          </pre>
                        </div>
                      </div>
                    );
                  })
                : "--brak prób--"}
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
          <section>
            <h2 className="py-6 text-center font-bold">Dostępność</h2>
            <div className="flex max-w-sm flex-col gap-2">
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
                      <h3 className="font-bold capitalize">{instrument}</h3>
                      <div className="flex flex-col gap-2">
                        {availabilityData
                          .filter((data) => data.instrument === instrument)
                          .map((avData) => {
                            return (
                              <div key={avData.user_id}>
                                <div className="flex gap-4">
                                  <p>{`${avData.first_name} ${avData.last_name}`}</p>
                                  <div className="ml-auto">
                                    <AvailabilityIcon
                                      status={avData.status}
                                      selected
                                    />
                                  </div>
                                </div>
                                <p className="text-sm text-foreground">
                                  {avData.message}
                                </p>
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
                  return (
                    <div className=" p-1" key={section}>
                      <h3 className="font-bold capitalize">{section}</h3>
                      <Separator className="my-2" />
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

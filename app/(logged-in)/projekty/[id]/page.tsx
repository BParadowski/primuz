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

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("projects")
    .select("name, location, description, pay, date")
    .eq("id", params.id)
    .single();
  const rehearsalQuery = await supabase
    .from("rehearsals")
    .select()
    .eq("project_id", params.id);
  const rehearsalsData = rehearsalQuery.data?.sort((a, b) =>
    a.start_datetime > b.start_datetime ? 1 : -1,
  );

  const user = await supabase.auth
    .getSession()
    .then(({ data: { session } }) => session?.user);

  const availabilityQuery = await supabase
    .from("availability")
    .select()
    .eq("project_id", params.id);
  const myAvailability = availabilityQuery.data?.find(
    (availability) => availability.user_id === user?.id,
  );

  if (!data) return <div>Nie udało się załadować strony projektu</div>;

  return (
    <main className="grid bg-primary">
      <div className="container mt-4 grid">
        <div className="flex flex-col justify-items-center gap-3 rounded-lg bg-background px-6 py-4">
          <h1 className="text-center text-2xl font-bold">{data.name}</h1>
          <div className="flex items-center gap-6">
            <MapPinIcon height={36} /> <p>{data.location}</p>{" "}
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
            <h1 className="py-6 text-center font-bold">Próby</h1>
            <div className="grid gap-y-4 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3">
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
            <h1 className="py-6 text-center font-bold">Twoja dostępność</h1>
            <AvailabilityPicker
              initialMessage={myAvailability?.message ?? ""}
              initialStatus={myAvailability?.status ?? "undeclared"}
              userId={user?.id ?? ""}
              projectId={params.id}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

import DeletePartPopup from "@/components/admin/deletePartPopup";
import NewPartForm from "@/components/admin/newPartForm";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { EyeIcon } from "lucide-react";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PiecePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const pieceDataQuery = supabase
    .from("pieces")
    .select()
    .eq("id", params.id)
    .single()
    .then(({ data }) => data);
  const partsQuery = supabase
    .from("parts")
    .select()
    .eq("piece_id", params.id)
    .then(({ data }) => data);

  const instrumentsQuery = supabase.rpc("get_instruments");

  const [pieceData, parts, { data: instruments }] = await Promise.all([
    pieceDataQuery,
    partsQuery,
    instrumentsQuery,
  ]);

  if (!pieceData || !parts)
    return (
      <main>
        <div className="container">
          <p>Nie udało się załadować strony utworu bądź utwór nie istnieje.</p>
        </div>
      </main>
    );

  return (
    <main>
      <div className="container">
        {" "}
        <h1 className="py-6 text-center text-xl font-bold">{pieceData.name}</h1>
        <NewPartForm
          pieceData={pieceData}
          parts={parts}
          instruments={
            instruments as Database["public"]["Enums"]["instrument"][]
          }
        />
        <div className="my-10 grid gap-y-3">
          {parts.map((part) => (
            <div key={part.id} className="flex items-center gap-6">
              <p className="capitalize">{part.name}</p>
              <Button asChild>
                <a
                  href={
                    supabase.storage
                      .from("sheet_music")
                      .getPublicUrl(part.file_name).data.publicUrl
                  }
                  target="__blank"
                >
                  {" "}
                  <EyeIcon />
                </a>
              </Button>
              <DeletePartPopup id={part.id} partPath={part.file_name} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

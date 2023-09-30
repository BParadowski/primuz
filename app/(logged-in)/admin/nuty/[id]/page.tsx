import { SheetMusicInput } from "@/components/admin/musicUpload";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const instruments = ["skrzypce", "altówka", "wiolonczela", "kontrabas"];

export default async function EditMusic({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from("pieces")
    .select()
    .eq("id", params.id)
    .single();
  return (
    <main className="container">
      <div>
        {instruments.map((instrumentName) => {
          if (instrumentName === "skrzypce") {
            return (
              <div key={instrumentName}>
                <SheetMusicInput
                  pieceName={data.name}
                  partName="skrzypce-1"
                  key={instrumentName}
                  instrument={instrumentName}
                />
                <SheetMusicInput
                  pieceName={data.name}
                  partName="skrzypce-2"
                  key={instrumentName}
                  instrument={instrumentName}
                />
              </div>
            );
          }
          return (
            <SheetMusicInput
              pieceName={data.name}
              partName={instrumentName}
              key={instrumentName}
              instrument={instrumentName}
            />
          );
        })}
      </div>
    </main>
  );
}

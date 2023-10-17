import NewPartForm from "@/components/admin/newPartForm";
import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
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

  const [pieceData, parts] = await Promise.all([pieceDataQuery, partsQuery]);

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
        <NewPartForm pieceData={pieceData} parts={parts} />
        {parts.map((part) => (
          <p key={part.id}>{part.name}</p>
        ))}
      </div>
    </main>
  );
}

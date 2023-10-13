import NewPieceForm from "@/components/admin/newPieceForm";
import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SheetMusicPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const pieces = await supabase
    .from("pieces")
    .select()
    .then(({ data }) => data);

  return (
    <main>
      <div className="container py-10">
        <NewPieceForm />
        <div className="pt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tytuł</TableHead>
                <TableHead>Kompozytor</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pieces &&
                pieces.map((piece) => (
                  <TableRow key={piece.id}>
                    <TableCell className="font-medium">{piece.name}</TableCell>
                    <TableCell>{piece.composer}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <Link href={`/admin/nuty/${piece.id}`}>Edytuj</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

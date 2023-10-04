import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DownloadButton } from "./musicDownloadButton";

export async function ListOfPieces(props: {
  projectId: string;
  instrument: string;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: pieces } = await supabase
    .from("project_repertoire")
    .select()
    .eq("project_id", props.projectId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utwór</TableHead>
          <TableHead className="text-right">Pobierz nuty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pieces &&
          pieces.map((pieceData) => {
            if (pieceData && pieceData.name)
              return (
                <TableRow key={pieceData.name}>
                  <TableCell className="font-medium">
                    {pieceData.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="">
                      {pieceData.parts &&
                        (pieceData.parts as { [K in string]: string[] })[
                          props.instrument
                        ].map((fileName, index) => {
                          return (
                            <DownloadButton
                              linkName={`${props.instrument} ${
                                (
                                  pieceData.parts as { [K in string]: string[] }
                                )[props.instrument].length > 1
                                  ? index + 1
                                  : ""
                              }`}
                              key={fileName}
                              fileName={fileName}
                              pieceName={pieceData.name}
                            />
                          );
                        })}
                    </div>
                  </TableCell>
                </TableRow>
              );
          })}
      </TableBody>
    </Table>
  );
}

import {
  Table,
  TableBody,
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

  type PieceObject = {
    [K in string]: {
      part: string;
      file: string;
    }[];
  };

  const piecesObject = pieces?.reduce((acc, c) => {
    // If there are no parts for this piece, for chosen instrument,  create an empty array or skip
    if (
      c.part_name === null ||
      c.file_name === null ||
      c.instrument !== props.instrument
    ) {
      if (!acc[c.piece_name]) acc[c.piece_name] = [];
      return acc;
    }

    if (!acc[c.piece_name]) {
      acc[c.piece_name] = [{ part: c.part_name, file: c.file_name }];
    } else if (acc[c.piece_name]) {
      acc[c.piece_name] = [
        ...acc[c.piece_name],
        { part: c.part_name, file: c.file_name },
      ];
    }

    return acc;
  }, {} as PieceObject);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utwór</TableHead>
          <TableHead className="text-right">Pobierz nuty</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {piecesObject &&
          Object.keys(piecesObject).map((title) => {
            return (
              <TableRow key={title}>
                <TableCell className="font-medium">{title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap justify-end gap-x-2 gap-y-2">
                    {piecesObject[title].map((partData) => (
                      <DownloadButton
                        key={partData.file}
                        filePath={partData.file}
                        linkName={partData.part}
                      />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

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
import DownloadButton from "./musicDownloadButton";

export async function ListOfPieces(props: {
  projectId: string;
  instrument: string;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  let { data: pieceIds } = await supabase
    .from("projects_pieces")
    .select("piece_id")
    .eq("project_id", props.projectId);

  if (!pieceIds) {
    pieceIds = [];
  }

  const { data } = await supabase
    .from("parts")
    .select(
      "part_name:name, file_name, instrument,piece_id, pieces!inner(name) ",
    )
    .in(
      "piece_id",
      pieceIds.map((idObject) => idObject.piece_id),
    );

  const pieces = data?.map((pieceData) => {
    const {
      part_name,
      file_name,
      instrument,
      piece_id,
      pieces: { name },
    } = pieceData;
    return { part_name, file_name, instrument, piece_id, piece_name: name };
  });

  type PieceObject = {
    [K in string]: {
      part: string;
      file: string;
      pieceName: string;
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
      acc[c.piece_name] = [
        { part: c.part_name, file: c.file_name, pieceName: c.piece_name },
      ];
    } else if (acc[c.piece_name]) {
      acc[c.piece_name] = [
        ...acc[c.piece_name],
        { part: c.part_name, file: c.file_name, pieceName: c.piece_name },
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
                        pieceName={partData.pieceName}
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

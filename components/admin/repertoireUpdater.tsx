"use client";

import { useRef, useState } from "react";
import { PiecePicker } from "./piecePicker";
import { PieceData } from "./piecePicker";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "../ui/use-toast";

export default function RepertoireUpdater(props: {
  initialRepertoire: PieceData[] | null;
  projectId: string;
}) {
  const addedPieces = useRef<string[]>([]);
  const removedPieces = useRef<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  function addPiece(pieceId: string) {
    if (
      props.initialRepertoire &&
      !props.initialRepertoire.find((pieceData) => pieceData.id === pieceId)
    ) {
      addedPieces.current = [...addedPieces.current, pieceId];
    }
  }

  function removePiece(pieceId: string) {
    if (
      props.initialRepertoire &&
      props.initialRepertoire.find((pieceData) => pieceData.id === pieceId)
    ) {
      removedPieces.current = [...removedPieces.current, pieceId];
    }
  }

  return (
    <div className="grid">
      <PiecePicker
        onPieceAdd={(pieceId) => {
          addPiece(pieceId);
          removedPieces.current = removedPieces.current.filter(
            (id) => id !== pieceId,
          );
        }}
        onPieceRemove={(pieceId) => {
          removePiece(pieceId);
          addedPieces.current = addedPieces.current.filter(
            (id) => id !== pieceId,
          );
        }}
        initialChosenPieces={props.initialRepertoire}
      />
      {updating ? (
        <Button type="button" size="lg" className="my-4 place-self-center">
          <Loader2Icon className="animate-spin" />
        </Button>
      ) : (
        <Button
          className="my-4 place-self-center"
          onClick={async () => {
            setUpdating(true);

            await supabase
              .from("projects_pieces")
              .delete()
              .eq("project_id", props.projectId)
              .in("piece_id", removedPieces.current);

            await supabase.from("projects_pieces").insert(
              addedPieces.current.map((pieceId) => {
                return { project_id: props.projectId, piece_id: pieceId };
              }),
            );
            toast({ description: "Repertuar został zaktualizowany." });

            setUpdating(false);
          }}
        >
          Zaktualizuj
        </Button>
      )}
    </div>
  );
}

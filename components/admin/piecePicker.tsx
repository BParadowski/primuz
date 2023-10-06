"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Database } from "@/lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";

interface PickerProps {
  onPieceAdd: (pieceId: string) => void;
  onPieceRemove: (pieceId: string) => void;
  initialChosenPieces?: PieceData[] | null;
}

export type PieceData = Database["public"]["Tables"]["pieces"]["Row"];

export function PiecePicker(props: PickerProps) {
  const supabase = createClientComponentClient<Database>();
  const [list, setList] = useState<null | PieceData[]>(null);
  const [chosenPieces, setChosenPieces] = useState<PieceData[]>(
    props.initialChosenPieces ?? [],
  );

  useEffect(() => {
    async function getPieces() {
      const { data } = await supabase.from("pieces").select();
      setList(data);
    }
    getPieces();
  }, []);

  return (
    <div className="mt-4">
      {list ? (
        <div>
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Wyszukaj utwór..." />

            <CommandList>
              <CommandEmpty>Brak rezultatów</CommandEmpty>

              {list.map((piece) => {
                if (
                  !chosenPieces.find(
                    (chosenPiece) => chosenPiece.name === piece.name,
                  )
                )
                  return (
                    <CommandItem key={piece.name}>
                      <p
                        onClick={() => {
                          props.onPieceAdd(piece.id);
                          setChosenPieces([...chosenPieces, piece]);
                        }}
                        className="w-full cursor-pointer"
                      >
                        {piece.name}
                      </p>
                    </CommandItem>
                  );
              })}
            </CommandList>
          </Command>
        </div>
      ) : (
        <p>Ładuję</p>
      )}
      <ol className="mt-6 flex flex-col gap-2">
        {chosenPieces &&
          chosenPieces.map((piece) => (
            <li
              key={piece.name}
              className="flex items-center rounded-sm border border-solid border-muted p-2"
            >
              {piece.name}
              <button
                onClick={() => {
                  props.onPieceRemove(piece.id);
                  setChosenPieces(
                    chosenPieces.filter(
                      (chosenPiece) => chosenPiece.id !== piece.id,
                    ),
                  );
                }}
                type="button"
                className="ml-auto"
              >
                <XIcon className="stroke-destructive"></XIcon>
              </button>
            </li>
          ))}
      </ol>
    </div>
  );
}

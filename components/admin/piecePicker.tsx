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

interface PickerProps {
  onPieceAdd: (pieceId: string) => void;
}

export function PiecePicker(props: PickerProps) {
  const supabase = createClientComponentClient<Database>();
  const [list, setList] = useState<
    null | Database["public"]["Tables"]["pieces"]["Row"][]
  >(null);
  const [chosenPieces, setChosenPieces] = useState<string[]>([]);

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
            <CommandEmpty>Brak rezultatów</CommandEmpty>
            <CommandList>
              {list.map((piece) => {
                if (!chosenPieces.find((name) => (name = piece.name)))
                  return (
                    <CommandItem key={piece.name}>
                      <span
                        onClick={() => {
                          props.onPieceAdd(piece.id);
                          setChosenPieces([...chosenPieces, piece.name]);
                        }}
                      >
                        {piece.name}
                      </span>
                    </CommandItem>
                  );
                else return null;
              })}
            </CommandList>
          </Command>
        </div>
      ) : (
        <p>Ładuję</p>
      )}
      <div className="mt-6">
        {chosenPieces &&
          chosenPieces.map((pieceName) => <p key={pieceName}>{pieceName}</p>)}
      </div>
    </div>
  );
}

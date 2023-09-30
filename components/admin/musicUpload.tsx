"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { replacePolishLetters } from "@/lib/utils";

interface InputProps {
  pieceName: string;
  partName: string;
  instrument: string;
}

export function SheetMusicInput({
  pieceName,
  partName,
  instrument,
}: InputProps) {
  const supabase = createClientComponentClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function saveMusic() {
    if (fileRef.current && fileRef.current.files) {
      setIsSaving(true);
      const newPieceFileName = replacePolishLetters(
        `${pieceName}-${partName}.pdf`,
      ).replace(/\s/g, "-");
      const newPieceFolder = replacePolishLetters(pieceName).replace(
        /\s/g,
        "-",
      );

      const { data, error } = await supabase.storage
        .from("sheet_music")
        .upload(
          `${newPieceFolder}/${newPieceFileName}`,
          fileRef.current.files[0],
        );

      // add to database list of piece parts

      if (!error) {
        const { data: pieceData } = await supabase
          .from("pieces")
          .select("parts")
          .eq("name", pieceName)
          .single();
        const structure: { [K in string]: string[] } = pieceData?.parts;
        if (instrument in structure) {
          structure[instrument] = [...structure[instrument], newPieceFileName];
        } else {
          structure[instrument] = [newPieceFileName];
        }
        await supabase
          .from("pieces")
          .update({ parts: structure })
          .eq("name", pieceName);
      }
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h2>{partName}</h2>
      <Input type="file" ref={fileRef} />
      {isSaving ? (
        <Button type="button" size="lg">
          <Loader2Icon className="animate-spin" />
        </Button>
      ) : (
        <Button
          type="submit"
          variant="default"
          size="lg"
          onClick={() => saveMusic()}
        >
          Zapisz nuty
        </Button>
      )}
    </div>
  );
}

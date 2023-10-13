"use client";

import { Button } from "@/components/ui/button";
import { Database } from "@/lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { replacePolishLetters, sortByInstrument } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

export const dynamic = "force-dynamic";

export default function EditMusic({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [pieceData, setPieceData] = useState<
    null | Database["public"]["Tables"]["pieces"]["Row"]
  >(null);
  const [chosenInstrument, setChosenInstrument] = useState<string>("skrzypce");

  const fileRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const pieceName = pieceData?.name;
  const partName = `${chosenInstrument}${
    // @ts-expect-error
    pieceData?.parts[chosenInstrument]
      ? // @ts-expect-error
        ` ${pieceData.parts[chosenInstrument].length + 1}`
      : ""
  }`;

  async function saveMusic() {
    if (!pieceData || !pieceName) return;

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
        //@ts-expect-error
        const structure: { [K in string]: string[] } = pieceData.parts;
        if (chosenInstrument in structure) {
          structure[chosenInstrument] = [
            ...structure[chosenInstrument],
            newPieceFileName,
          ];
        } else {
          structure[chosenInstrument] = [newPieceFileName];
        }
        await supabase
          .from("pieces")
          .update({ parts: structure })
          .eq("name", pieceName);
      }
      setIsSaving(false);
    }
  }

  useEffect(() => {
    async function getParts() {
      const data = await supabase
        .from("pieces")
        .select()
        .eq("id", params.id)
        .single()
        .then(({ data }) => data);

      setPieceData(data);
    }
    if (isSaving === false) getParts();
  }, [isSaving]);

  return (
    <main className="container">
      <h1 className="py-6 text-center text-xl font-bold">
        {pieceData && pieceData.name}
      </h1>
      <Select
        value={chosenInstrument}
        onValueChange={(e) => setChosenInstrument(e)}
      >
        <SelectTrigger>Instrument</SelectTrigger>
        <SelectContent>
          <SelectItem value="skrzypce">skrzypce</SelectItem>
          <SelectItem value="altówka">altówka</SelectItem>
          <SelectItem value="wiolonczela">wiolonczela</SelectItem>
          <SelectItem value="kontrabas">kontrabas</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid gap-y-2">
        <h2 className="mt-6 text-lg capitalize">Partia: {partName}</h2>
        <Input type="file" ref={fileRef} />
        {isSaving ? (
          <Button type="button" size="lg" className="place-self-center">
            <Loader2Icon className="animate-spin" />
          </Button>
        ) : (
          <Button
            className="place-self-center"
            type="submit"
            variant="default"
            size="lg"
            onClick={() => saveMusic()}
          >
            Dodaj Partię
          </Button>
        )}
      </div>
      <div className="mt-12">
        {pieceData &&
          pieceData.parts &&
          sortByInstrument(Object.keys(pieceData.parts)).map((instrument) => {
            // @ts-expect-error

            if (!pieceData.parts[instrument]) return null;
            // @ts-expect-error

            return pieceData.parts[instrument].map((partName) => (
              <p key={partName}>{partName}</p>
            ));
          })}
      </div>
    </main>
  );
}

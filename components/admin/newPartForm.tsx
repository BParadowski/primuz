"use client";

import { Database } from "@/lib/supabase";
import { replacePolishLetters, toRoman } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  partName: z.string().min(1, { message: "Partia musi mieć nazwę." }),
  file: z.custom<File>((file) => file instanceof File, {
    message: "Brak pliku.",
  }),
});

type SchemaType = z.infer<typeof formSchema>;

export default function NewPartForm({
  pieceData,
  parts,
  instruments,
}: {
  pieceData: Database["public"]["Tables"]["pieces"]["Row"];
  parts: Database["public"]["Tables"]["parts"]["Row"][];
  instruments: Database["public"]["Enums"]["instrument"][];
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [chosenInstrument, setChosenInstrument] =
    useState<Database["public"]["Enums"]["instrument"]>("skrzypce");

  const partName = `${chosenInstrument}${
    parts.filter((part) => part.instrument === chosenInstrument).length > 0 ||
    chosenInstrument === "skrzypce"
      ? ` ${toRoman(
          parts.filter((part) => part.instrument === chosenInstrument).length +
            1,
        )}`
      : ""
  }`;
  const pieceName = pieceData.name;

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partName: partName,
      file: undefined,
    },
  });

  async function saveMusic(partName: string, file: File) {
    let newPartFileName = replacePolishLetters(
      `${pieceName}-${partName}`,
    ).replace(/\s/g, "-");

    console.log(newPartFileName);

    // If there is another part named liked that append number to the end (files can't share a name)
    while (parts.find((part) => part.file_name === newPartFileName + ".pdf")) {
      console.log("SHakavu");
      newPartFileName += `(${
        parts.filter((part) => part.instrument === chosenInstrument).length + 1
      })`;
    }
    // add extension

    newPartFileName += ".pdf";

    console.log(newPartFileName);

    const newPartFolder = replacePolishLetters(pieceName).replace(/\s/g, "-");

    const newPartPath = `${newPartFolder}/${newPartFileName}`;

    const { data, error } = await supabase.storage
      .from("sheet_music")
      .upload(newPartPath, file);

    // if storage didn't throw an error, put part info into the database

    if (!error) {
      await supabase.from("parts").insert({
        piece_id: pieceData.id,
        instrument: chosenInstrument,
        name: partName,
        file_name: newPartPath,
      });
    }
  }

  return (
    <div>
      <Select
        value={chosenInstrument}
        onValueChange={(e) => {
          setChosenInstrument(e as Database["public"]["Enums"]["instrument"]);
          form.setValue(
            "partName",
            `${e}${
              parts.filter((part) => part.instrument === e).length > 0
                ? ` ${toRoman(
                    parts.filter((part) => part.instrument === e).length + 1,
                  )}`
                : ""
            }`,
          );
        }}
      >
        <SelectTrigger>{chosenInstrument}</SelectTrigger>
        <SelectContent>
          {instruments.map((instrument) => (
            <SelectItem key={instrument} value={instrument}>
              {instrument}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Form {...form}>
        <form
          className="mt-6 grid gap-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            await saveMusic(data.partName, data.file);
            router.refresh();
            form.reset({
              partName: `${chosenInstrument}${
                parts.filter((part) => part.instrument === chosenInstrument)
                  .length > 0
                  ? ` ${toRoman(
                      parts.filter(
                        (part) => part.instrument === chosenInstrument,
                      ).length + 2,
                    )}`
                  : " II"
              }`,
              file: undefined,
            });
          })}
        >
          <FormField
            control={form.control}
            name="partName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa partii</FormLabel>
                <FormControl>
                  <Input placeholder="skrzypce II góra..." {...field} />
                </FormControl>
                <FormDescription>
                  Nazwa linku w liście utworów i partii.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Plik</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    placeholder="Prześlij nuty"
                    accept="application/pdf"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormDescription>W formacie PDF</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.isSubmitting ? (
            <Button type="button" size="lg" className="my-6 place-self-center">
              <Loader2Icon className="animate-spin" />
            </Button>
          ) : (
            <Button
              disabled={Boolean(form.formState.errors.partName)}
              type="submit"
              variant="default"
              size="lg"
              className="my-6 place-self-center"
            >
              Dodaj Partię
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

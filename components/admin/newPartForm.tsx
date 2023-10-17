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
}: {
  pieceData: Database["public"]["Tables"]["pieces"]["Row"];
  parts: Database["public"]["Tables"]["parts"]["Row"][];
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [chosenInstrument, setChosenInstrument] =
    useState<Database["public"]["Enums"]["instrument"]>("skrzypce");

  const partName = `${chosenInstrument}${
    parts.filter((part) => part.instrument === chosenInstrument).length > 0
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
    if (file) {
      const newPieceFileName = replacePolishLetters(
        `${pieceName}-${chosenInstrument}${
          parts.filter((part) => part.instrument === chosenInstrument).length >
          0
            ? ` ${toRoman(
                parts.filter((part) => part.instrument === chosenInstrument)
                  .length + 1,
              )}`
            : ""
        }.pdf`,
      ).replace(/\s/g, "-");

      const newPieceFolder = replacePolishLetters(pieceName).replace(
        /\s/g,
        "-",
      );

      const { data, error } = await supabase.storage
        .from("sheet_music")
        .upload(`${newPieceFolder}/${newPieceFileName}`, file);

      // if storage didn't throw an error, put part info into the database

      if (!error) {
        await supabase.from("parts").insert({
          piece_id: pieceData.id,
          instrument: chosenInstrument,
          name: partName,
          file_name: newPieceFileName,
        });
      }
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
          <SelectItem value="skrzypce">skrzypce</SelectItem>
          <SelectItem value="altówka">altówka</SelectItem>
          <SelectItem value="wiolonczela">wiolonczela</SelectItem>
          <SelectItem value="kontrabas">kontrabas</SelectItem>
        </SelectContent>
      </Select>

      <Form {...form}>
        <form
          className="mt-6 grid gap-y-6"
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
                    accept="image/*, application/pdf"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
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
